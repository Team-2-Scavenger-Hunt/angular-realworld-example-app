import { TestBed } from "@angular/core/testing";
import { MarkdownPipe } from "./markdown.pipe";

describe("MarkdownPipe", () => {
  let pipe: MarkdownPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MarkdownPipe],
    });
    pipe = TestBed.inject(MarkdownPipe);
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("should transform markdown to HTML", async () => {
    const markdown = "# Hello World";
    const result = await pipe.transform(markdown);
    expect(result).toContain("<h1");
    expect(result).toContain("Hello World");
    expect(result).toContain("</h1>");
  });

  it("should transform markdown links", async () => {
    const markdown = "[Angular](https://angular.io)";
    const result = await pipe.transform(markdown);
    expect(result).toContain("<a");
    expect(result).toContain('href="https://angular.io"');
    expect(result).toContain("Angular");
    expect(result).toContain("</a>");
  });

  it("should transform markdown bold text", async () => {
    const markdown = "**bold text**";
    const result = await pipe.transform(markdown);
    expect(result).toContain("<strong>");
    expect(result).toContain("bold text");
    expect(result).toContain("</strong>");
  });

  it("should transform markdown italic text", async () => {
    const markdown = "*italic text*";
    const result = await pipe.transform(markdown);
    expect(result).toContain("<em>");
    expect(result).toContain("italic text");
    expect(result).toContain("</em>");
  });

  it("should transform markdown code blocks", async () => {
    const markdown = '```javascript\nconsole.log("hello");\n```';
    const result = await pipe.transform(markdown);
    expect(result).toContain("<pre>");
    expect(result).toContain("<code");
    expect(result).toContain("console.log");
  });

  it("should sanitize potentially dangerous HTML", async () => {
    const markdown = '<script>alert("xss")</script>';
    const result = await pipe.transform(markdown);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain('alert("xss")');
  });

  it("should handle empty content", async () => {
    const result = await pipe.transform("");
    expect(result).toBe("");
  });

  it("should handle null content gracefully", async () => {
    const result = await pipe.transform(null as any);
    expect(result).toBe("");
  });

  it("should transform markdown lists", async () => {
    const markdown = "- Item 1\n- Item 2\n- Item 3";
    const result = await pipe.transform(markdown);
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
    expect(result).toContain("Item 1");
    expect(result).toContain("Item 2");
    expect(result).toContain("Item 3");
    expect(result).toContain("</li>");
    expect(result).toContain("</ul>");
  });
});
