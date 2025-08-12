// src/lib/shopify/richtext.tsx
import React from "react";

type TextNode = {
  type: "text";
  value?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type RootNode = { type: "root"; children?: RTNode[] };
type ParagraphNode = { type: "paragraph"; children?: RTNode[] };
type HeadingNode = { type: "heading"; level?: 1 | 2 | 3 | 4 | 5 | 6; children?: RTNode[] };
type ListNode = { type: "list"; listType?: "ordered" | "unordered"; children?: RTNode[] };
type ListItemNode = { type: "list-item"; children?: RTNode[] };
type LinkNode = {
  type: "link";
  url: string;
  title?: string;
  target?: string;
  children?: RTNode[];
};
type BlockquoteNode = { type: "blockquote"; children?: RTNode[] };
type CodeBlockNode = { type: "code_block"; code?: string; children?: RTNode[] };
type LineBreakNode = { type: "line_break" };

type RTNode =
  | TextNode
  | RootNode
  | ParagraphNode
  | HeadingNode
  | ListNode
  | ListItemNode
  | LinkNode
  | BlockquoteNode
  | CodeBlockNode
  | LineBreakNode;

function isRTNode(value: unknown): value is RTNode {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string"
  );
}

function renderChildren(children?: RTNode[]) {
  return children?.map((c, i) => renderNode(c, i));
}

function renderText(node: TextNode) {
  let el: React.ReactNode = node.value ?? "";
  if (node.bold) el = <strong>{el}</strong>;
  if (node.italic) el = <em>{el}</em>;
  if (node.underline) el = <u>{el}</u>;
  if (node.strikethrough) el = <s>{el}</s>;
  if (node.code) el = <code>{el}</code>;
  return el;
}

function renderNode(node: RTNode, key?: React.Key): React.ReactNode {
  if (!node) return null;
  switch (node.type) {
    case "root":
      return <>{renderChildren(node.children)}</>;
    case "paragraph":
      return <p key={key}>{renderChildren(node.children)}</p>;
    case "text":
      return <span key={key}>{renderText(node)}</span>;
    case "heading": {
      const level = (node.level ?? 2) as 1 | 2 | 3 | 4 | 5 | 6;
      const tag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return React.createElement(tag, { key }, renderChildren(node.children));
    }
    case "list": {
      const tag = (node.listType === "ordered" ? "ol" : "ul") as
        | "ol"
        | "ul";
      return React.createElement(tag, { key }, renderChildren(node.children));
    }
    case "list-item":
      return <li key={key}>{renderChildren(node.children)}</li>;
    case "link":
      return (
        <a
          key={key}
          href={node.url}
          title={node.title || undefined}
          target={node.target || undefined}
          rel={node.target === "_blank" ? "noopener noreferrer" : undefined}
        >
          {renderChildren(node.children)}
        </a>
      );
    case "blockquote":
      return <blockquote key={key}>{renderChildren(node.children)}</blockquote>;
    case "code_block":
      return (
        <pre key={key}>
          <code>{node.code || renderChildren(node.children)}</code>
        </pre>
      );
    case "line_break":
      return <br key={key} />;
    default:
      return null;
  }
}

export function RichText({
  value,
  className = "",
}: {
  value: string | RTNode;
  className?: string;
}) {
  let root: RTNode | undefined = undefined;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value) as unknown;
      if (isRTNode(parsed)) {
        root = parsed;
      } else {
        return <div className={className}>{value}</div>;
      }
    } catch {
      return <div className={className}>{value}</div>;
    }
  } else if (isRTNode(value)) {
    root = value;
  }

  if (!root) {
    return <div className={className} />;
  }

  return <div className={`prose max-w-none ${className}`}>{renderNode(root)}</div>;
}