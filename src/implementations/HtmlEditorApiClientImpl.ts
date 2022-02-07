import { Result } from "../abstractions/common/result-types";
import { AppConfiguration } from "../abstractions";
import { HtmlEditorApiClient } from "../abstractions/html-editor-api-client";
import { AxiosStatic, Method } from "axios";
import { AppSessionStateAccessor } from "../abstractions/app-session";
import { Content } from "../abstractions/domain/content";

export class HtmlEditorApiClientImpl implements HtmlEditorApiClient {
  private axios;
  private appSessionStateAccessor;

  constructor({
    axiosStatic,
    appSessionStateAccessor,
    appConfiguration: { htmlEditorApiBaseUrl },
  }: {
    axiosStatic: AxiosStatic;
    appSessionStateAccessor: AppSessionStateAccessor;
    appConfiguration: Partial<AppConfiguration>;
  }) {
    this.axios = axiosStatic.create({
      baseURL: htmlEditorApiBaseUrl,
    });
    this.appSessionStateAccessor = appSessionStateAccessor;
  }

  private getConnectionData() {
    const connectionData = this.appSessionStateAccessor.current;
    if (connectionData.status !== "authenticated") {
      throw new Error("Authenticated session required");
    }
    return {
      accountName: connectionData.dopplerAccountName,
      jwtToken: connectionData.jwtToken,
    };
  }

  private request<T>(method: Method, url: string, data: unknown = undefined) {
    const { accountName, jwtToken } = this.getConnectionData();
    return this.axios.request<T>({
      method,
      url: `/accounts/${accountName}${url}`,
      headers: { Authorization: `Bearer ${jwtToken}` },
      data,
    });
  }

  private GET<T>(url: string) {
    return this.request<T>("GET", url);
  }

  private PUT(url: string, data: unknown) {
    return this.request<any>("PUT", url, data);
  }

  async getCampaignContent(campaignId: string): Promise<Result<Content>> {
    const response = await this.GET<any>(`/campaigns/${campaignId}/content`);

    if (!response.data.meta) {
      throw new Error(
        `Not implemented: Content responses without 'meta' property are not supported yet.`
      );
    }

    return {
      success: true,
      value: {
        // TODO: consider to sanitize and validate this response
        design: response.data.meta,
        htmlContent: response.data.htmlContent,
        type: "unlayer",
      },
    };
  }

  async updateCampaignContent(
    campaignId: string,
    content: Content
  ): Promise<Result> {
    if (content.type !== "unlayer") {
      throw new Error(
        `Not implemented: Content type '${content.type}' is not supported yet.`
      );
    }
    const body = {
      meta: content.design,
      htmlContent: content.htmlContent,
    };
    await this.PUT(`/campaigns/${campaignId}/content`, body);
    return { success: true };
  }
}
