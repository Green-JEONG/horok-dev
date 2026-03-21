import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import CodeBlock from "@/components/posts/CodeBlock";

type Props = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={[
        "max-w-none text-sm leading-7 text-foreground",
        "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
        "[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground",
        "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em]",
        "[&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold",
        "[&_h2]:mt-7 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold",
        "[&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold",
        "[&_hr]:my-6 [&_hr]:border-border",
        "[&_img]:my-4 [&_img]:max-h-[32rem] [&_img]:w-full [&_img]:rounded-xl [&_img]:border [&_img]:border-border [&_img]:object-contain",
        "[&_li]:my-1",
        "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_p]:my-4 [&_p]:whitespace-pre-wrap",
        "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
        "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden",
        "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2",
        "[&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
        "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
        className,
      ].join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize, rehypeHighlight]}
        components={{
          code(props) {
            const { children, className: codeClassName, ...rest } = props;
            const inline =
              "inline" in props && typeof props.inline === "boolean"
                ? props.inline
                : false;

            if (inline) {
              return (
                <code className={codeClassName} {...rest}>
                  {children}
                </code>
              );
            }

            const code = getCodeText(children).replace(/\n$/, "");

            return (
              <CodeBlock code={code} className={codeClassName}>
                {children}
              </CodeBlock>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function getCodeText(children: ComponentProps<"code">["children"]): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (!children) return "";
  if (Array.isArray(children)) {
    return children.map((child) => getCodeText(child)).join("");
  }
  if (typeof children === "object" && "props" in children) {
    return getCodeText(
      (
        children as {
          props?: ComponentProps<"code">;
        }
      ).props?.children,
    );
  }
  return "";
}
