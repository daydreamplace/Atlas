// Live reference for the text styles in styles/typography.css.
// Served at /style-guide and kept out of the GNB. All text here describes
// the styles themselves — it is not project content.

const codeSample = `def normalize(values, scale=1.0):
    """Divide every value by the largest one, then apply a scale."""
    peak = max(values)
    return [scale * v / peak for v in values]`;

export function StyleGuide() {
  return (
    <>
      <p className="text-lead">
        Lead paragraph (<code>.text-lead</code>). Use it once at the top of a
        page or a major section to summarise what follows in one or two
        sentences.
      </p>

      <h2>Section title (h2)</h2>
      <p>
        Body text (<code>&lt;p&gt;</code>). This is the default for everything
        written on a page: 16px with generous line height so long explanations
        stay readable. Use <strong>strong</strong> for the words a reader must
        not miss, <em>emphasis</em> for a change in tone, and{" "}
        <span className="text-accent">.text-accent</span> for a recurring key
        term. <mark>&lt;mark&gt;</mark> highlights a short phrase, and{" "}
        <a href="#links">links</a> are underlined in the accent colour.
      </p>
      <p>
        Variables and symbols use <code>&lt;var&gt;</code>, with{" "}
        <code>&lt;sub&gt;</code> and <code>&lt;sup&gt;</code> for indices:{" "}
        <var>k</var>
        <sub>IN</sub>, <var>V</var>
        <sub>max</sub>, <var>x</var>
        <sup>2</sup>.
      </p>

      <h3>Subsection title (h3)</h3>
      <p>
        Use h3 to split a section into topics. Keep headings short; long ones
        wrap onto balanced lines.
      </p>

      <h4>Minor heading (h4)</h4>
      <p>
        Use h4 for a small label inside a subsection, such as a protocol step
        group.
      </p>

      <p className="text-small">
        Small text (<code>.text-small</code>) for notes and fine print.
      </p>

      <h2>Lists</h2>
      <ul>
        <li>Unordered list item</li>
        <li>
          Item with a nested list
          <ul>
            <li>Nested item</li>
          </ul>
        </li>
      </ul>
      <ol>
        <li>Ordered list for steps that happen in sequence</li>
        <li>Second step</li>
      </ol>

      <h2>Quote</h2>
      <blockquote>
        <p>
          A blockquote for a quotation from an interview or stakeholder.
          Attribute it with a cite line below.
        </p>
        <cite>— Name, Role, Organisation</cite>
      </blockquote>

      <h2>Figures and captions</h2>
      <figure>
        <div className="style-guide-placeholder" aria-hidden="true">
          Image goes here
        </div>
        <figcaption>
          <strong>Figure 1.</strong> Caption (<code>&lt;figcaption&gt;</code>).
          Start with the figure number, then say what the reader should see.
        </figcaption>
      </figure>

      <h2>Code</h2>
      <p>
        Inline code for file names, commands and identifiers:{" "}
        <code>model.py</code>, <code>npm run build</code>.
      </p>
      <figure>
        <figcaption>
          <strong>Code 1.</strong> A captioned code block.
        </figcaption>
        <pre>
          <code>{codeSample}</code>
        </pre>
      </figure>

      <h2>Table</h2>
      <div className="table-wrap">
        <table>
          <caption>
            <strong>Table 1.</strong> Wrap tables in <code>.table-wrap</code> so
            wide ones scroll on small screens.
          </caption>
          <thead>
            <tr>
              <th>Part number</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>BBa_XXXXXX</code>
              </td>
              <td>Coding</td>
              <td>One row per part; keep descriptions to a sentence.</td>
            </tr>
            <tr>
              <td>
                <code>BBa_XXXXXX</code>
              </td>
              <td>Promoter</td>
              <td>Second example row.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Callout</h2>
      <div className="bd-callout bd-callout-info">
        <h4>Callout title</h4>
        <p>Use a callout for notes that sit beside the main text.</p>
      </div>

      <h2>References</h2>
      <ol className="references">
        <li>
          Author, A., &amp; Author, B. (Year). Title of the article.{" "}
          <em>Journal Name</em>, volume(issue), pages. https://doi.org/…
        </li>
        <li>
          Use <code>&lt;ol className="references"&gt;</code> for the reference
          list at the end of a page.
        </li>
      </ol>
    </>
  );
}
