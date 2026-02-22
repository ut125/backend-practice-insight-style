import { startMockProcess, checkMockStatus } from "./mockApi.js";

export async function runProcess() {
  console.log("runProcess 被呼叫"); // <-- 這行是方便你確認 Retry 有觸發
  const shareOption = localStorage.getItem("shareOption") || "none";
  const downloadOption = localStorage.getItem("downloadOption") || "none";

  console.log("使用者選擇的分享方式：", shareOption);
  console.log("使用者選擇的下載方式：", downloadOption);

  try {
    // TODO: 接後端
    await startMockProcess({ shareOption, downloadOption });
    //TODO:接後端-查詢任務狀態（輪詢）
    const status = await checkMockStatus();

    const emailSuccess = status.email === "success";
    const downloadSuccess = status.download === "success";

    if (emailSuccess && downloadSuccess) {
      console.log("✅ 兩者成功");
      window.location.href = "success.html";
    } else if (!emailSuccess && downloadSuccess) {
      console.log("⚠️ email 失敗，download 成功");
      window.location.href = "downloadSuccess.html";
    } else if (emailSuccess && !downloadSuccess) {
      console.log("⚠️ email 成功，download 失敗");
      window.location.href = "emailSuccess.html";
    } else {
      console.log("❌ 兩者都失敗");
      window.location.href = "promotion_status.html";
    }
  } catch (error) {
    console.error("API 發生錯誤：", error);
    window.location.href = "promotion_status.html";
  }
}

// ✅ 僅當目前是 loading_1.html 頁面時才執行 runProcess()
if (window.location.pathname.includes("loading_1.html")) {
  runProcess();
}
