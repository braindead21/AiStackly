// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
  }
}

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("config", process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "", {
      page_path: url,
    });
  }
};

// Track tool click events
export const trackToolClick = (toolId: string, toolName: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "tool_click", {
      tool_id: toolId,
      tool_name: toolName,
      event_category: "engagement",
      event_label: toolName,
    });
  }
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "external_link_click", {
      link_url: url,
      link_text: linkText || url,
      event_category: "outbound",
      event_label: url,
    });
  }
};

// Track search tool usage
export const trackSearchTool = (searchQuery: string, resultsCount?: number) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", "search_tool", {
      search_term: searchQuery,
      results_count: resultsCount,
      event_category: "search",
      event_label: searchQuery,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window.gtag !== "undefined") {
    window.gtag("event", eventName, eventParams);
  }
};
