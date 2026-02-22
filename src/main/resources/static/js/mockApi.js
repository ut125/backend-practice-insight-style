// // mockApi.js
//
// // Set up the conditions to be tested
// const mockConfig = {
//     email: "success",   // can setting "success" or "fail"
//     download: "success"
//   };
//
//   // starting Simulated API
//   export function startMockProcess({ shareOption, downloadOption }) {
//     console.log("[Mock API] Received selection：", shareOption, downloadOption);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log("[Mock API] Processing task...");
//         resolve({ status: "started" });
//       }, 500); // after 0.5 second will jump to next page
//     });
//   }
//
//   // Simulate API to check task status
//   export function checkMockStatus() {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         console.log("[Mock API] Return to task status：", mockConfig);
//         resolve(mockConfig); // Return the currently set status
//       }, 500);
//     });
//   }
//
//   // mockApi.js
//
//   export async function downloadFile(useMock = true) {
//     if (useMock) {
//       // Simulate downloading a PDF file
//       const mockContent = "This is a mock PDF content.";
//       const blob = new Blob([mockContent], { type: "application/pdf" });
//       triggerDownload(blob, "mock-report.pdf");
//       console.log("[Mock API] Simulated download complete");
//     } else {
//       try {
//         const response = await fetch("/api/download-report"); // Real API
//         if (!response.ok) throw new Error("Download failed");
//         const blob = await response.blob();
//         triggerDownload(blob, "report.pdf");
//         console.log("[Real API] Actual download completed");
//       } catch (error) {
//         console.error("Download error：", error);
//         alert("An error occurred during the download process.");
//     }
//   }
// }
//
// function triggerDownload(blob, filename) {
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = filename;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
//
// // Simulate the email submission process
// export async function submitEmailMock(email) {
//   console.log("[Mock API] Received user email：", email);
//
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({ status: "ok" }); // Simulate a successful response
//     }, 500); // simulated delay
//   });
// }