// src/lib/shopify/richtext.tsx
import React from "react";

type RTNode = { type: string; [key: string]: any };

function renderChildren(children?: RTNode[]) {
  return children?.map((c, i) => renderNode(c, i));
}

function renderText(node: any) {
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
      const Tag = (`h${node.level || 2}` as unknown) as keyof JSX.IntrinsicElements;
      return <Tag key={key}>{renderChildren(node.children)}</Tag>;
    }
    case "list": {
      const ListTag = (node.listType === "ordered" ? "ol" : "ul") as
        | "ol"
        | "ul";
      return <ListTag key={key}>{renderChildren(node.children)}</ListTag>;
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
  value: string | object;
  className?: string;
}) {
  let root: any = value;
  if (typeof value === "string") {
    try {
      root = JSON.parse(value);
    } catch {
      return <div className={className}>{value}</div>;
    }
  }
  return <div className={`prose max-w-none ${className}`}>{renderNode(root)}</div>;
}