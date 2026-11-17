/** A conceptual illustration using only the project's public description. */
export function ExMachinaArtwork({ name }: { name: string }) {
  return (
    <div className="exm-art">
      <div className="exm-art-heading">
        <span>
          COLLECTIVE
          <br />
          INTELLIGENCE.
        </span>
        <span className="exm-art-edition">RUST / MULTI-AGENT</span>
      </div>
      <svg
        className="exm-art-network"
        viewBox="0 0 1000 460"
        fill="none"
        focusable="false"
        aria-hidden="true"
      >
        <g className="exm-art-guides" stroke="currentColor" strokeWidth="1">
          <circle cx="500" cy="230" r="188" strokeDasharray="2 9" />
          <circle cx="500" cy="230" r="112" />
          <path d="M100 230H900M500 25V435" strokeDasharray="2 9" />
        </g>
        <g className="exm-art-edges" stroke="currentColor" strokeWidth="1.25">
          <path d="M500 230 320 68 145 230 320 392 500 230 680 68 855 230 680 392 500 230" />
          <path d="M320 68H680L320 392H680L320 68M145 230H855M500 230 320 68M500 230 680 392" />
        </g>
        <g
          className="exm-art-nodes"
          fill="var(--bg)"
          stroke="currentColor"
          strokeWidth="1.25"
        >
          {[
            [320, 68],
            [680, 68],
            [145, 230],
            [855, 230],
            [320, 392],
            [680, 392],
          ].map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="18" />
              <path d={`M${x - 4} ${y}h8M${x} ${y - 4}v8`} />
            </g>
          ))}
        </g>
        <g className="exm-art-hub" stroke="currentColor" strokeWidth="1.5">
          <path d="m500 186 44 44-44 44-44-44Z" fill="var(--bg)" />
          <path d="M485 221 476 230l9 9M515 221l9 9-9 9M505 213l-10 34" />
        </g>
        <g
          className="exm-art-labels"
          fill="currentColor"
          fontFamily="var(--stack-mono)"
          fontSize="12"
          letterSpacing="2"
        >
          <text x="288" y="30">
            AGENT
          </text>
          <text x="648" y="30">
            AGENT
          </text>
          <text x="113" y="277">
            AGENT
          </text>
          <text x="823" y="277">
            AGENT
          </text>
          <text x="288" y="442">
            AGENT
          </text>
          <text x="648" y="442">
            AGENT
          </text>
        </g>
      </svg>
      <div className="exm-art-footer">
        <span>{name.toUpperCase()}</span>
        <span>COLLABORATION / COORDINATION</span>
        <span className="exm-art-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </div>
  );
}
