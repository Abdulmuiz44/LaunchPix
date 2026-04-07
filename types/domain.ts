export type ProductType = "chrome_extension" | "firefox_addon" | "saas" | "launch_campaign";

export interface Project {
  id: string;
  name: string;
  productType: ProductType;
  status: "draft" | "processing" | "ready";
}
