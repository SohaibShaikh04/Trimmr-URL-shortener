import { Copy, Trash, Link2, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "@/hooks/use-fetch";
import { deleteUrl } from "@/db/apiUrls";
import { BeatLoader } from "react-spinners";

const LinkCard = ({ url = {}, fetchUrls }) => {
  const navigate = useNavigate();
  const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  const shortLink = `${window.location.origin}/${url.custom_url || url.short_url}`;

  const handleDelete = async (e) => {
    e.stopPropagation();
    await fnDelete();
    fetchUrls();
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(shortLink);
  };

  return (
    <div
      className="neu-card-sm"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        cursor: "pointer",
        transition: "box-shadow 0.2s",
      }}
      onClick={() => navigate(`/link/${url.id}`)}
    >
      {/* QR Thumbnail */}
      <div
        className="neu-inset"
        style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {url.qr ? (
          <img src={url.qr} alt="QR" style={{ width: 40, height: 40, objectFit: "contain" }} />
        ) : (
          <Link2 size={20} color="var(--text-muted)" />
        )}
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {url.title}
          </span>
        </div>
        <div style={{ fontSize: 13, color: "var(--primary)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {shortLink}
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          <ExternalLink size={11} style={{ display: "inline", marginRight: 3 }} />
          {url.original_url}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
        <button className="neu-btn-icon" onClick={handleCopy} title="Copy link">
          <Copy size={15} />
        </button>
        <button
          className="neu-btn-icon"
          onClick={handleDelete}
          disabled={loadingDelete}
          title="Delete"
          style={{ color: loadingDelete ? "var(--text-muted)" : "var(--danger)" }}
        >
          {loadingDelete ? <BeatLoader size={4} color="var(--danger)" /> : <Trash size={15} />}
        </button>
      </div>
    </div>
  );
};

export default LinkCard;
