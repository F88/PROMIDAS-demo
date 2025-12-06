import type { NormalizedPrototype } from "@f88/promidas";
import "./PrototypeCard.css";

interface PrototypeCardProps {
  prototype: NormalizedPrototype;
}

export function PrototypeCard({ prototype }: PrototypeCardProps) {
  return (
    <div className="prototype-card">
      <h2>{prototype.prototypeNm}</h2>

      <div className="prototype-meta">
        <p className="prototype-id">ID: {prototype.id}</p>
        {prototype.teamNm && (
          <p className="team-name">Team: {prototype.teamNm}</p>
        )}
      </div>

      {prototype.tags && prototype.tags.length > 0 && (
        <div className="tags">
          {prototype.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {prototype.summary && <p className="summary">{prototype.summary}</p>}

      {prototype.mainUrl && (
        <a
          href={prototype.mainUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="prototype-link"
        >
          View on ProtoPedia →
        </a>
      )}

      <div className="prototype-footer">
        <span>👁 {prototype.viewCount}</span>
        <span>❤️ {prototype.goodCount}</span>
        <span>💬 {prototype.commentCount}</span>
      </div>
    </div>
  );
}
