"use client";

import { useState } from "react";
import type { UserResponse, UserCreate } from "@/types/api";

interface MyPageProps {
  user: UserResponse | null;
  isLoggedIn: boolean;
  onLogin: (username: string, password: string) => Promise<void>;
  onSignup: (data: UserCreate) => Promise<void>;
  onLogout: () => void;
}

export default function MyPage({ user, isLoggedIn, onLogin, onSignup, onLogout }: MyPageProps) {
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 로그인 폼
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 폼
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupBirth, setSignupBirth] = useState("");
  const [signupPhone, setSignupPhone] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(loginUsername, loginPassword);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await onSignup({
        username: signupUsername,
        password: signupPassword,
        email: signupEmail,
        birth: signupBirth,
        phone: signupPhone || undefined,
      });
      setSuccess("회원가입이 완료되었습니다! 로그인해주세요.");
      setAuthTab("login");
      setLoginUsername(signupUsername);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 로그인 상태: 프로필
  if (isLoggedIn && user) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        <div className="max-w-[480px] mx-auto px-4 py-8 sm:py-10">
          {/* 프로필 카드 */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 mb-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#E8513D] to-[#F97316] flex items-center justify-center shrink-0">
                <span className="text-xl sm:text-2xl text-white font-bold">{user.nickname.charAt(0)}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{user.nickname}</h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-500">생년월일</span>
                <span className="text-sm font-medium text-gray-700">{user.birth}</span>
              </div>
              {user.phone && (
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-500">전화번호</span>
                  <span className="text-sm font-medium text-gray-700">{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl text-sm font-semibold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            로그아웃
          </button>
        </div>
      </div>
    );
  }

  // 비로그인 상태: 로그인/회원가입 폼
  return (
    <div className="flex-1 overflow-y-auto bg-gray-50/50">
      <div className="max-w-[480px] mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#E8513D] to-[#F97316] bg-clip-text text-transparent mb-1">
            배부룩
          </h2>
          <p className="text-sm text-gray-400">로그인하고 리뷰를 남겨보세요</p>
        </div>

        {/* 탭 전환 */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setAuthTab("login"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              authTab === "login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400"
            }`}
          >
            로그인
          </button>
          <button
            onClick={() => { setAuthTab("signup"); setError(""); setSuccess(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              authTab === "signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-400"
            }`}
          >
            회원가입
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-600">
            {success}
          </div>
        )}

        {authTab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">아이디</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#E8513D] to-[#F97316] hover:from-[#d4462f] hover:to-[#e5623f] transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm mt-2"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">아이디</label>
              <input
                type="text"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">비밀번호</label>
              <input
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="비밀번호를 입력하세요"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">이메일</label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">생년월일</label>
              <input
                type="date"
                value={signupBirth}
                onChange={(e) => setSignupBirth(e.target.value)}
                required
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 text-gray-700"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">전화번호 <span className="text-gray-300">(선택)</span></label>
              <input
                type="tel"
                value={signupPhone}
                onChange={(e) => setSignupPhone(e.target.value)}
                className="w-full bg-white rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E8513D]/20 placeholder:text-gray-300"
                style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                placeholder="010-1234-5678"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#E8513D] to-[#F97316] hover:from-[#d4462f] hover:to-[#e5623f] transition-all active:scale-[0.98] disabled:opacity-50 shadow-sm mt-2"
            >
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
