export async function enqueueNormalization(uploadId: string) {
  return {
    uploadId,
    status: "queued",
    note: "Normalization pipeline hook prepared for Prompt 3 wiring."
  } as const;
}
