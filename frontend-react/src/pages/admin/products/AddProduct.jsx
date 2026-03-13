import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../api/product.api.js";

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Food & Beverage",
  "Home & Garden",
  "Sports",
  "Books",
  "Toys",
  "Beauty",
  "Other",
];

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  stock: "",
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Validation ────────────────────────────────────────────────────
  function validate(data) {
    const errs = {};
    if (!data.name.trim()) errs.name = "กรุณากรอกชื่อสินค้า";
    if (!data.price || isNaN(data.price) || Number(data.price) < 0)
      errs.price = "กรุณากรอกราคาที่ถูกต้อง";
    if (!data.category) errs.category = "กรุณาเลือกหมวดหมู่";
    if (data.stock !== "" && (isNaN(data.stock) || Number(data.stock) < 0))
      errs.stock = "จำนวนสต็อกต้องไม่ติดลบ";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      category: form.category,
      imageUrl: form.imageUrl.trim(),
      stock: form.stock !== "" ? Number(form.stock) : 0,
    };

    try {
      setLoading(true);
      await productApi.create(payload);
      setSuccessMsg("เพิ่มสินค้าเรียบร้อยแล้ว!");
      setForm(initialForm);
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch (err) {
      setErrorMsg(
        err?.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="ย้อนกลับ"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">เพิ่มสินค้า</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              กรอกข้อมูลสินค้าใหม่ลงในระบบ
            </p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Image Preview */}
          <div className="bg-linear-to-r from-indigo-500 to-purple-600 h-36 flex items-center justify-center">
            {form.imageUrl ? (
              <img
                src={form.imageUrl}
                alt="preview"
                className="h-full w-full object-cover opacity-80"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="flex flex-col items-center text-white/70 select-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mb-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 19.5h16.5M13.5 9.75a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span className="text-sm">ตัวอย่างรูปภาพ</span>
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Alert: Success */}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {successMsg}
              </div>
            )}

            {/* Alert: Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errorMsg}
              </div>
            )}

            {/* Row 1: Name */}
            <Field label="ชื่อสินค้า" required error={errors.name}>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="เช่น หูฟังไร้สาย Sony WH-1000XM5"
                className={inputCls(errors.name)}
              />
            </Field>

            {/* Row 2: Description */}
            <Field label="รายละเอียด" error={errors.description}>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="อธิบายสินค้าโดยย่อ..."
                className={inputCls(errors.description) + " resize-none"}
              />
            </Field>

            {/* Row 3: Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="ราคา (บาท)" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                    ฿
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className={inputCls(errors.price) + " pl-7"}
                  />
                </div>
              </Field>

              <Field label="จำนวนสต็อก" error={errors.stock}>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className={inputCls(errors.stock)}
                />
              </Field>
            </div>

            {/* Row 4: Category */}
            <Field label="หมวดหมู่" required error={errors.category}>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputCls(errors.category) + " cursor-pointer"}
              >
                <option value="">— เลือกหมวดหมู่ —</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            {/* Row 5: Image URL */}
            <Field label="URL รูปภาพ" error={errors.imageUrl}>
              <input
                type="url"
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={inputCls(errors.imageUrl)}
              />
            </Field>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    เพิ่มสินค้า
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Helper Components ─────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputCls(error) {
  return [
    "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-colors",
    "placeholder:text-gray-300",
    error
      ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
      : "border-gray-200 bg-gray-50 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100",
  ].join(" ");
}
