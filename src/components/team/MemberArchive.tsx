import { useEffect, useRef, useState } from "react";
import { teamGroups as groups, type Member } from "../../data/members";

export function MemberArchive({ members }: { members: Member[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selected = members.find((member) => member.id === selectedId);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerRef.current?.focus();
    };
  }, [selected]);

  const openMember = (memberId: string, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setSelectedId(memberId);
  };

  return (
    <div className="team-archive">
      <div className="member-groups">
        {groups.map((group, groupIndex) => {
          const people = members.filter((member) => member.group === group);
          return (
            <section className="member-group" id={`group-${group.toLowerCase()}`} data-group={group} key={group}>
              <header><p>{String(groupIndex + 1).padStart(2, "0")} / {group.toUpperCase()}</p><span>{String(people.length).padStart(2, "0")} PEOPLE</span></header>
              <div className="contact-sheet">
                {people.map((member, index) => (
                  <button type="button" key={member.id} className="contact-card" onClick={(event) => openMember(member.id, event.currentTarget)} aria-haspopup="dialog">
                    <span className={`contact-photo tone-${(index + groupIndex) % 4}`} aria-hidden="true" />
                    <span className="contact-number">{String(index + 1).padStart(2, "0")}</span>
                    <span><strong>{member.name}</strong><small>{member.role}</small></span>
                    <i aria-hidden="true">↗</i>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {selected ? (
        <div className="member-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedId(null)}>
          <section className="member-modal" role="dialog" aria-modal="true" aria-labelledby="member-modal-title">
            <div className="modal-light" aria-hidden="true" />
            <button className="modal-close" type="button" ref={closeButtonRef} onClick={() => setSelectedId(null)} aria-label="Close member profile"><span>CLOSE</span> ×</button>
            <div className="modal-stage" aria-hidden="true" />
            <div className="modal-copy">
              <p className="modal-kicker">ROLE GROUP / {selected.group}</p>
              <h2 id="member-modal-title">{selected.name}</h2>
              <dl className="modal-details">
                <div><dt>PART</dt><dd>{selected.keywords.join(" · ")}</dd></div>
                <div><dt>ROLE</dt><dd>{selected.role}</dd></div>
                <div><dt>SCHOOL</dt><dd>{selected.school ?? "Hongik University"}</dd></div>
              </dl>
              <p className="modal-content">{selected.introduction}</p>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
