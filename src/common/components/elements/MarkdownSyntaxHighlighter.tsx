import React from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import materialOceanic from 'react-syntax-highlighter/dist/cjs/styles/prism/material-oceanic'
import c from 'react-syntax-highlighter/dist/cjs/languages/prism/c'
import cpp from 'react-syntax-highlighter/dist/cjs/languages/prism/cpp'

interface MarkdownSyntaxHighlighterProps {
  language: string
}

SyntaxHighlighter.registerLanguage('c', c)
SyntaxHighlighter.registerLanguage('cpp', cpp)

const MarkdownSyntaxHighlighter: React.FC<MarkdownSyntaxHighlighterProps> = ({
  language,
  children,
}) => {
  return (
    <SyntaxHighlighter
      lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
      wrapLines={true}
      style={materialOceanic}
      language={language}
      customStyle={{
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  )
}

export default MarkdownSyntaxHighlighter
