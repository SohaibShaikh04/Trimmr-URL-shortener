import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as yup from "yup";
import { BeatLoader } from "react-spinners";
import { X, Plus, Link2 } from "lucide-react";
import { createUrl } from "@/db/apiUrls";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";
import { QRCode } from "react-qrcode-logo";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  longUrl: yup.string().url("Must be a valid URL").required("Long URL is required"),
  customUrl: yup.string(),
});

export function CreateLink() {
  const { user } = UrlState();
  const navigate = useNavigate();
  const ref = useRef();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  });

  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, {
    ...formValues,
    user_id: user.id,
  });

  useEffect(() => {
    if (longLink) setOpen(true);
  }, [longLink]);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0]?.id || data?.id}`);
    }
  }, [error, data]);

  const handleChange = (e) => {
    setFormValues((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  const handleCreate = async () => {
    setErrors({});
    try {
      await schema.validate(formValues, { abortEarly: false });
      const canvas = ref.current?.canvasRef?.current;
      const blob = canvas ? await new Promise((res) => canvas.toBlob(res)) : null;
      await fnCreateUrl(blob);
    } catch (e) {
      const errs = {};
      e?.inner?.forEach((err) => { errs[err.path] = err.message; });
      setErrors(errs);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchParams({});
    setFormValues({ title: "", longUrl: "", customUrl: "" });
    setErrors({});
  };

  return (
    <>
      <button
        className="neu-btn-primary"
        onClick={() => setOpen(true)}
        style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px" }}
      >
        <Plus size={16} />
        Create
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(30, 35, 60, 0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
          onClick={handleClose}
        >
          <div
            className="neu-card"
            style={{ width: "100%", maxWidth: 480, padding: 32, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20, color: "var(--text-primary)" }}>Create New Link</h2>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Shorten and track your URL</p>
              </div>
              <button className="neu-btn-icon" onClick={handleClose}>
                <X size={16} />
              </button>
            </div>

            {/* QR Preview */}
            {formValues.longUrl && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <div className="neu-inset" style={{ padding: 12, borderRadius: 14, display: "inline-block" }}>
                  <QRCode ref={ref} size={140} value={formValues.longUrl} qrStyle="dots" />
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                  Link Title
                </label>
                <input
                  id="title"
                  className="neu-input"
                  placeholder="e.g. My Portfolio"
                  value={formValues.title}
                  onChange={handleChange}
                />
                {errors.title && <span style={{ fontSize: 11, color: "var(--danger)", marginTop: 4, display: "block" }}>{errors.title}</span>}
              </div>

              {/* Long URL */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                  Destination URL
                </label>
                <input
                  id="longUrl"
                  className="neu-input"
                  placeholder="https://your-long-url.com/..."
                  value={formValues.longUrl}
                  onChange={handleChange}
                />
                {errors.longUrl && <span style={{ fontSize: 11, color: "var(--danger)", marginTop: 4, display: "block" }}>{errors.longUrl}</span>}
              </div>

              {/* Custom Alias */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: 6 }}>
                  Custom Alias <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="neu-inset" style={{ padding: "10px 12px", borderRadius: 10, fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 4 }}>
                    <Link2 size={12} />
                    {window.location.hostname}/
                  </div>
                  <input
                    id="customUrl"
                    className="neu-input"
                    placeholder="my-link"
                    value={formValues.customUrl}
                    onChange={handleChange}
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {error && <p style={{ fontSize: 12, color: "var(--danger)" }}>{error.message}</p>}

              <button
                className="neu-btn-primary"
                onClick={handleCreate}
                disabled={loading}
                style={{ width: "100%", padding: 14, marginTop: 4 }}
              >
                {loading ? <BeatLoader size={8} color="#fff" /> : "Create Short Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
