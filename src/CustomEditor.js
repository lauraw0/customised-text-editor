import { Editor, Transforms, Text } from 'slate'
// Defining custom set of helpers rather than built-in Editor helpers
const CustomEditor = {
    isBoldMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.bold === true,
            universal: true,
        })
        return !!match
    },
    isUnderlineMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.underline === true,
            universal: true,
        })
        return !!match
    },
    isItalicsMarkActive(editor) {
        const [match] = Editor.nodes(editor, {
            match: n => n.italics === true,
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
    toggleUnderlineMark(editor) {
        const isActive = CustomEditor.isUnderlineMarkActive(editor)
        // Apply it to text nodes, splitting the nodes up
        // if selection is overlapping only a bit
        Transforms.setNodes(
            editor,
            { underline: isActive ? null : true },
            { match: n => Text.isText(n), split: true }
        )
    },
    toggleItalicsMark(editor) {
        const isActive = CustomEditor.isItalicsMarkActive(editor)
        Transforms.setNodes(
            editor,
            { italics: isActive ? null : true },
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
    },
    toggleLeftAlignBlock(editor) {
        Transforms.setNodes(
            editor,
            { align: 'left' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
    toggleMiddleAlignBlock(editor) {
        Transforms.setNodes(
            editor,
            { align: 'center' },
            { match: n => Editor.isBlock(editor, n) }
        )
    },
    toggleRightAlignBlock(editor) {
        Transforms.setNodes(
            editor,
            { align: 'right' },
            { match: n => Editor.isBlock(editor, n) }
        )
    }
}

export default CustomEditor;