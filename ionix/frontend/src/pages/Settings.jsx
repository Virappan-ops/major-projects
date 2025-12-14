// FULL Settings.jsx — VisionOS Premium Edition
// Paste entire file as is

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Lock,
  Camera,
  Loader2,
  Palette,
  Check,
  Lock as LockIcon,
  Sun,
  Moon,
  Sliders,
  Trash2,
  CreditCard,
} from "lucide-react";

import api from "../lib/api";
import { useThemeStore } from "../theme/themeEngine";
import "../styles/Settings.css";

export default function Settings() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [pic, setPic] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const { themeName, setThemeName, mode, setMode } = useThemeStore();

  const [accent, setAccent] = useState("#6366f1");
  const [blurIntensity, setBlurIntensity] = useState(10);
  const [sidebarStyle, setSidebarStyle] = useState("wide");

  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const fileRef = useRef(null);

  const themes = [
    { id: "aurora", name: "Aurora", free: true, colors: ["#F5F5F7", "#6366f1"] },
    { id: "oceanic", name: "Oceanic", free: false, colors: ["#06b6d4", "#0369a1"] },
    { id: "nebula", name: "Nebula", free: false, colors: ["#7c3aed", "#db2777"] },
    { id: "midnight", name: "Midnight", free: false, colors: ["#0a0f1f", "#001f3f"] },
    { id: "cosmos", name: "Cosmos", free: false, colors: ["#020617", "#2563eb"] },
  ];

  useEffect(() => {
    const raw = localStorage.getItem("userInfo");
    if (!raw) return;
    const u = JSON.parse(raw);

    setName(u.name || "");
    setEmail(u.email || "");
    setPic(u.pic || "");
    setIsPremium(!!u.isPremium);

    setUsername(u.username || "");
    setBio(u.bio || "");

    setAccent(u.accent || "#6366f1");
    setSidebarStyle(u.sidebarStyle || "wide");
    setBlurIntensity(u.blurIntensity ?? 10);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);

  useEffect(() => {
    document.documentElement.style.setProperty("--global-blur", `${blurIntensity}px`);
  }, [blurIntensity]);

  const handleImageUpload = (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return setMessage("Max file size: 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setPic(reader.result);
    reader.readAsDataURL(file);
  };

  const handleThemeSelect = (t) => {
    if (!t.free && !isPremium) return setMessage("Upgrade to unlock premium themes.");
    setThemeName(t.id);
    const raw = localStorage.getItem("userInfo");
    if (raw) {
      const u = JSON.parse(raw);
      u.themeName = t.id;
      localStorage.setItem("userInfo", JSON.stringify(u));
    }
  };

  const toggleMode = () => {
    const m = mode === "dark" ? "light" : "dark";
    setMode(m);

    const raw = localStorage.getItem("userInfo");
    if (raw) {
      const u = JSON.parse(raw);
      u.mode = m;
      localStorage.setItem("userInfo", JSON.stringify(u));
    }
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword)
      return setMessage("Passwords don't match");

    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", {
        name,
        email,
        pic,
        password,
        bio,
        username,
      });

      const raw = localStorage.getItem("userInfo");
      const local = raw ? JSON.parse(raw) : {};

      const merged = {
        ...local,
        ...data,
        bio,
        username,
        accent,
        blurIntensity,
        sidebarStyle,
      };

      localStorage.setItem("userInfo", JSON.stringify(merged));

      setMessage("Saved successfully!");
      setPassword("");
      setConfirmPassword("");
    } catch {
      setMessage("Failed to update profile.");
    }
    setSaving(false);
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      const { data } = await api.put("/users/premium", {});
      const raw = localStorage.getItem("userInfo");
      const local = raw ? JSON.parse(raw) : {};

      const merged = {
        ...local,
        ...data,
      };

      localStorage.setItem("userInfo", JSON.stringify(merged));
      setIsPremium(true);
      setMessage("Upgraded to Pro! 🎉");
    } catch {
      setMessage("Upgrade failed.");
    }
    setUpgrading(false);
  };

  const savePreferences = () => {
    const raw = localStorage.getItem("userInfo");
    const local = raw ? JSON.parse(raw) : {};
    const merged = { ...local, accent, blurIntensity, sidebarStyle };
    localStorage.setItem("userInfo", JSON.stringify(merged));
    setMessage("Preferences saved");
  };

  return (
    <div className="settings-root">

      <div className="settings-grid">

        {/* LEFT SECTION */}
        <div className="col-left">

          {/* PROFILE CARD */}
          <div className="card profile-card">
            <div className="card-head">
              <div className="card-title"><Palette size={18}/> Profile</div>
              <div className="card-sub">Personal info, avatar & bio</div>
            </div>

            <div className="card-body">

              <div className="profile-top">
                <div className="avatar-wrap">
                  <img src={pic} className="avatar-img" />
                  <div className="avatar-overlay" onClick={() => fileRef.current.click()}>
                    <Camera size={18}/>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleImageUpload(e.target.files[0])} />
                </div>

                <div className="profile-meta">
                  <div className="meta-row">
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} />
                  </div>

                  <div className="meta-row">
                    <label>Username</label>
                    <input value={username} onChange={e => setUsername(e.target.value)} placeholder="@username" />
                  </div>

                  <div className="meta-row">
                    <label>Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* ACCOUNT CARD */}
          <div className="card account-card">
            <div className="card-head">
              <div className="card-title"><User size={18}/> Account</div>
              <div className="card-sub">Email & security</div>
            </div>

            <div className="card-body">

              <div className="meta-row">
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="meta-row">
                <label>New Password</label>
                <input type="password" value={password}
                  onChange={e => setPassword(e.target.value)} />
              </div>

              <div className="meta-row">
                <label>Confirm Password</label>
                <input type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)} />
              </div>

              <button className="btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="spin"/> : "Save Profile"}
              </button>

            </div>
          </div>

          {/* PREFERENCES CARD */}
          <div className="card prefs-card">
            <div className="card-head">
              <div className="card-title"><Sliders size={18}/> Preferences</div>
              <div className="card-sub">Appearance & behaviour</div>
            </div>

            <div className="card-body">

              <div className="pref-row">
                <label>Theme Mode</label>
                <button className="pill" onClick={toggleMode}>
                  {mode === "dark" ? <Moon size={14}/> : <Sun size={14}/>}
                  {mode}
                </button>
              </div>

              <div className="pref-row">
                <label>Blur Intensity</label>
                <input type="range" min="0" max="22"
                  value={blurIntensity}
                  onChange={e => setBlurIntensity(Number(e.target.value))} />
              </div>

              <div className="pref-row">
                <label>Accent Color</label>
                <div className="accent-row">
                  <input type="color" value={accent} onChange={e => setAccent(e.target.value)} />
                </div>
              </div>

              <button className="btn-outline" onClick={savePreferences}>
                Save Preferences
              </button>

            </div>
          </div>

        </div>


        {/* RIGHT SECTION */}
        <div className="col-right">

          {/* PREMIUM CARD */}
          <div className="card premium-card">
            <div className="card-head">
              <div className="card-title"><CreditCard size={18}/> Ionix Pro</div>
              <div className="card-sub">Unlock premium visual features</div>
            </div>

            <div className="card-body">

              <div className="premium-hero">
                <div>
                  <div className="hero-badge">{isPremium ? "PRO" : "FREE"}</div>
                  <h3>{isPremium ? "You're a Pro member ✨" : "Upgrade for premium themes!"}</h3>
                </div>

                {!isPremium ? (
                  <button className="btn-primary premium-btn" onClick={handleUpgrade} disabled={upgrading}>
                    {upgrading ? <Loader2 className="spin"/> : "Upgrade"}
                  </button>
                ) : (
                  <div className="tag success">Active</div>
                )}
              </div>

            </div>
          </div>

          {/* THEME STUDIO */}
          <div className="card themes-card">
            <div className="card-head">
              <div className="card-title"><Palette size={18}/> Theme Studio</div>
              <div className="card-sub">Choose your visual style</div>
            </div>

            <div className="theme-grid">

              {themes.map((t) => {
                const locked = !t.free && !isPremium;
                const active = themeName === t.id;

                return (
                  <div
                    key={t.id}
                    onClick={() => handleThemeSelect(t)}
                    className={`theme-tile ${active ? "active" : ""} ${locked ? "locked" : ""}`}
                  >
                    <div className="preview"
                      style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }}
                    />

                    <div className="meta">
                      <span className="name">{t.name}</span>
                      <span className="foot">
                        {locked ? <LockIcon size={12}/> : active ? <Check size={14}/> : "Apply"}
                      </span>
                    </div>

                    {locked && <div className="locked-scrim">PRO</div>}
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>


      {message && (
        <div className="toast">
          {message}
          <button className="toast-close" onClick={() => setMessage(null)}>x</button>
        </div>
      )}

    </div>
  );
}
