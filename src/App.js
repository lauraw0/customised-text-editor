// Import React dependencies
import React, { useCallback, useState, useMemo } from 'react'
// Import the Slate editor factory, 'Editor' and 'Transforms' helpers
import { createEditor } from 'slate'
// import { Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import CustomEditor from './CustomEditor'


// A serializing function that takes a value and returns a string.
// const serialize = value => {
//     return (
//         value
//             // Return the string content of each paragraph in the value's children
//             .map(n => Node.string(n))
//             // join each paragraph with a new line
//             .join('\n')
//     )
// }

// A deserializing function that takes a string and returns a value.
// const deserialize = value => {
//     // Return a value array of children derived by splitting the string
//     return string.split('\n').map(line => {
//         return {
//             children: [{ text: line }],
//         }
//     })
// }

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
        <span {...props.attributes} style={{
            fontWeight: props.leaf.bold ? 'bold' : 'normal',
            fontStyle: props.leaf.italics ? 'italic' : 'normal',
            textDecoration: props.leaf.underline ? 'underline' : 'normal'
        }}>
            {props.children}
        </span>
    )
}

const App = () => {
    // This Slate editor object won't change across renders as we don't set it
    const [editor] = useState(() => withReact(createEditor()))

    // If we are not using JSON format but instead serializing into plain text
    // const initialValue = useMemo(
    //     deserialize(localStorage.getItem('content')) || '',
    //     []
    // )

    // Update the initial content to be pulled from Local Storage if it exists.
    const initialValue = useMemo(
        () =>
            JSON.parse(localStorage.getItem('content')) ||
            [
                {
                    type: 'paragraph',
                    children: [{ text: 'Start typing here to test text editor' }]
                }
            ],
        []
    )

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
        <Slate
            editor={editor}
            value={initialValue}
            onChange={value => {
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                if (isAstChange) {
                    // If we attempt to serialize into plain text
                    // localStorage.setItem('content', serialize(value))

                    // Save value to Local Storage.
                    const content = JSON.stringify(value)
                    localStorage.setItem('content', content)
                }
            }}
        >
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
                        case 'i': {
                            event.preventDefault()
                            CustomEditor.toggleItalicsMark(editor)
                            break
                        }
                        case 'u': {
                            event.preventDefault()
                            CustomEditor.toggleUnderlineMark(editor)
                            break
                        }
                        case 'Delete': {
                            event.preventDefault()
                            localStorage.clear()
                            break
                        }
                    }
                }}
            />
        </Slate>
    )
}

export default App;