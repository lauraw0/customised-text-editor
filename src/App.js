// Import React dependencies
import React, { useCallback, useState } from 'react'
// Import the Slate editor factory, 'Editor' and 'Transforms' helpers
import { createEditor, Editor, Transforms, Text } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'


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
        // Add the editable component inside the context
        <Slate editor={editor} value={initialValue} >
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
                            // Check whether any of the currently selected blocks are code blocks
                            const [match] = Editor.nodes(editor, {
                                match: n => n.type === 'code',
                            })

                            // toggle block type depending on whether there's already a match
                            Transforms.setNodes(
                                editor,
                                { type: match ? 'paragraph' : 'code' },
                                { match: n => Editor.isBlock(editor, n) }
                            )
                            break
                        }
                        // when "b" is pressed bold our text selection
                        case 'b': {
                            event.preventDefault()
                            Transforms.setNodes(
                                editor,
                                { bold: true },
                                // Apply it to text nodes, splitting the nodes up
                                // if selection is overlapping only a bit
                                { match: n => Text.isText(n), split: true }
                            )
                            break
                        }
                    }
                    console.log(event.key)
                }}
            />
        </Slate>
    )
}

export default App;