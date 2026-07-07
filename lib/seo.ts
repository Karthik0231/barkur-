import type { Metadata } from "next"
import { TEMPLE_NAME, TEMPLE_LOCATION } from "@/lib/constants"

interface GenerateMetadataParams {
  page?: string
  customTitle?: string
  customDescription?: string
  customImage?: string
  path?: string
}

const siteName = `${TEMPLE_NAME} | ${TEMPLE_LOCATION.split(",")[0]}`

const defaultTitle = `${TEMPLE_NAME} | ${TEMPLE_LOCATION}`
const defaultDescription = `Experience divine grace at ${TEMPLE_NAME} in ${TEMPLE_LOCATION}. Book sevas, make donations, and explore our rich spiritual heritage.`
const defaultImage = "/og-image.jpg"

const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")

export function generateMetadata({
  page,
  customTitle,
  customDescription,
  customImage,
  path = "/",
}: GenerateMetadataParams = {}): Metadata {
  const title = customTitle
    ? `${customTitle} | ${siteName}`
    : page
      ? `${page} | ${siteName}`
      : defaultTitle

  const description = customDescription ?? defaultDescription
  const image = customImage ?? defaultImage
  const url = `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: url,
    },
    metadataBase: new URL(baseUrl),
  }
}
