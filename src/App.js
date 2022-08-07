// Import React dependencies
import React, { useCallback, useState } from 'react'
// Import the Slate editor factory, 'Editor' and 'Transforms' helpers
import { createEditor, Editor, Transforms, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

// Defining custom set of helpers rather than built-in Editor helpers
const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })
        return !!match
    },
    isCodeBlockActive(editor) {
        // Check whether any of the currently selected blocks are code blocks
        const [match] = Editor.nodes(editor, {
            match: n => n.type === 'code',
        })
        return !!match
    },
    toggleBoldMark(editor) {
        const isActive = CustomEditor.isBoldMarkActive(editor)
        // Apply it to text nodes, splitting the nodes up
        // if selection is overlapping only a bit
        Transforms.setNodes(
            editor,
            { bold: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },
    toggleCodeBlock(editor) {
        // toggle block type depending on whether there's already a match
        const isActive = CustomEditor.isCodeBlockActive(editor)
        Transforms.setNodes(
            editor,
            { type: isActive ? null : 'code' },
            { match: n => Editor.isBlock(editor, n) }
        )
    }
}


const initialValue = [
    {
        type: 'paragraph',
        children: [{ text: 'wowee starter text for slate js' }]
    }
]

// Adding renderers for code blocks
const CodeElement = (props) => {
    return (
        // attributes that will be rendered on the top-most element of your blocks
        <pre {...props.attributes}>
            {/* must render children as the lowest leaf in the components */}
            <code>{props.children}</code>
        </pre>
    )
}
const DefaultElement = props => {
    return (
        <p {...props.attributes}>{props.children}</p>
    )
}

const Leaf = props => {
    return (
        <span {...props.attributes} style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}>
            {props.children}
        </span>
    )
}

const App = () => {
    // This Slate editor object won't change across renders as we don't set it
    const [editor] = useState(() => withReact(createEditor()))

    // Rendering function based on the element passed to 'props'
    // 'useCallback' memoizes the function for subsequent renders.
    const renderElement = useCallback(props => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />
            default:
                return <DefaultElement {...props} />
        }
    }, [])

    const renderLeaf = useCallback(props => {
        return <Leaf {...props} />
    }, [])

    return (
        // Add a toolbar with buttons that call the same methods
        // Add the editable component inside the context
        <Slate editor={editor} value={initialValue} >
            <div>
                <button
                    onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toggleBoldMark(editor)
                    }}
                >
                    Bold
                </button>
                <button
                    onMouseDown={event => {
                        event.preventDefault()
                        CustomEditor.toggleCodeBlock(editor)
                    }}
                >
                    Code Block
                </button>
            </div>
            <Editable
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                //Define a new handler which creates code blocks
                onKeyDown={event => {
                    if (!event.ctrlKey) return
                    switch (event.key) {
                        // When "`" is presssed turn the block into code
                        case '`': {
                            // prevent ' from being inserted
                            event.preventDefault()
                            CustomEditor.toggleCodeBlock(editor)
                            break
                        }
                        // when "b" is pressed bold our text selection
                        case 'b': {
                            event.preventDefault()
                            CustomEditor.toggleBoldMark(editor)
                            break
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default App;