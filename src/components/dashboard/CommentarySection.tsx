import type { Program } from "../../types";

interface CommentarySectionProps {
  program: Program;
}

export default function CommentarySection({ program }: CommentarySectionProps) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5">
      <div className="section-label">Commentary</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {program.commentary.map((item) => (
          <div key={item.function} className="border border-border rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">{item.function}</span>
                <span className="text-[10px] text-muted-foreground">{item.owner}</span>
              </div>
              <span className={`text-[9px] font-semibold px-2 py-0.5 rounded ${item.color}`}>
                {item.status}
              </span>
            </div>
            <ul className="space-y-1">
              {item.bullets.map((bullet, i) => (
                <li key={i} className="text-[10px] text-muted-foreground flex gap-1.5">
                  <span className="text-primary mt-0.5">&bull;</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
