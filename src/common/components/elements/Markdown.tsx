import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
const MarkdownSyntaxHighlighter = dynamic(
  () => import('@/components/elements/MarkdownSyntaxHighlighter')
)
import rehypeRaw from 'rehype-raw'
import AnchorLink from './AnchorLink'

interface MarkdownProps {
  markdown: string
}

const Markdown = ({ markdown }: MarkdownProps) => {
  return (
    <ReactMarkdown
      rehypePlugins={[rehypeRaw]}
      components={{
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <div className="break-inside-avoid">
              <MarkdownSyntaxHighlighter language={match[1]}>
                {String(children).replace(/\n$/, '')}
              </MarkdownSyntaxHighlighter>
            </div>
          ) : (
            <code
              className={
                className +
                ' py-1 px-2 m-0 text-sm rounded bg-gray-700 print:bg-gray-800 print:text-white'
              }
              {...props}
            >
              {children}
            </code>
          )
        },
        a: ({ node, children, ...props }) => (
          <AnchorLink href={props.href ?? ''} target="_blank">
            {children}
          </AnchorLink>
        ),
        img: ({ node, children, ...props }) => (
          <div className="w-full flex justify-center break-inside-avoid">
            <img {...props}></img>
          </div>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside pl-4 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
          <ul className="list-decimal list-inside mb-4">{children}</ul>
        ),
        h1: ({ children }) => (
          <h1 className="border-b border-b-white/[0.24] mt-6 mb-4 text-3xl pb-2 font-medium">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="border-b border-b-white/[0.24] mt-6 mb-4 text-2xl pb-2 font-medium">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-xl font-medium mt-6 mb-4">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="font-medium mt-6 mb-4">{children}</h4>
        ),
        h5: ({ children }) => (
          <h5 className="text-sm font-medium mt-6 mb-4">{children}</h5>
        ),
        h6: ({ children }) => (
          <h6 className="text-sm text-white/50 font-medium mt-6 mb-4">
            {children}
          </h6>
        ),
        p: ({ children }) => <p className="mb-4 mt-0">{children}</p>,
        blockquote: ({ children }) => (
          <blockquote
            className="flex gap-x-2 py-2 px-4 rounded-md
    text-sky-400 bg-sky-300/[0.15] mt-4 mb-3 print:text-sky-600 print:bg-sky-400/20"
          >
            <FontAwesomeIcon
              className="my-auto"
              icon={faCircleExclamation}
            ></FontAwesomeIcon>
            {children}
          </blockquote>
        ),
      }}
    >
      {markdown ?? 'Content not available'}
    </ReactMarkdown>
  )
}

export default Markdown
