import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  try {
    const res = await fetch(
      `https://api.0x.org/swap/permit2/price?${searchParams}`,
      {
        headers: {
          "0x-api-key": 'ada5ace1-5006-4d17-8ca5-1045cc1415fb',
          "0x-version": "v2",
        },
      }
    );
    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.log(error);
  }
}
