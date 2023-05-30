import { timeout } from "../../utils";
import { DopplerLegacyClient } from "../../abstractions/doppler-legacy-client";
import { Result } from "../../abstractions/common/result-types";
import { ImageItem } from "../../abstractions/domain/image-gallery";

const baseUrl =
  "https://www.fromdoppler.com/wp-content/themes/doppler_site/img";
export const demoImages: ImageItem[] = [
  {
    name: "omnicanalidad-email-marketing.png",
    lastModifiedDate: new Date(2022, 11, 22),
    size: 456,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-email-marketing.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-email-marketing.png`,
  },
  {
    name: "omnicanalidad-sms.png",
    lastModifiedDate: new Date(2023, 3, 4),
    size: 123,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-sms.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-sms.png`,
  },
  {
    name: "omnicanalidad-emailtransaccional.png",
    lastModifiedDate: new Date(2023, 1, 2),
    size: 678,
    extension: ".png",
    url: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
    thumbnailUrl150: `${baseUrl}/omnicanalidad-emailtransaccional.png`,
  },
];

export class DummyDopplerLegacyClient implements DopplerLegacyClient {
  getImageGallery: () => Promise<Result<{ items: ImageItem[] }>> = async () => {
    console.log("Begin getImageGallery...");
    await timeout(1000);

    const result = {
      success: true as const,
      value: { items: demoImages },
    };

    console.log("End getImageGallery", { result });
    return result;
  };
}
