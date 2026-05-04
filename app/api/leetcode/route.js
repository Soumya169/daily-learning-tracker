import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const userProgressQuery = `
  query userProgress($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        realName
        ranking
      }
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      submissionCalendar
    }
    recentAcSubmissionList(username: $username, limit: 20) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username")?.trim();

  if (!username) {
    return NextResponse.json({ success: false, error: "LeetCode username is required." }, { status: 400 });
  }

  try {
    const res = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com",
        "User-Agent": "daily-learning-tracker",
      },
      body: JSON.stringify({
        query: userProgressQuery,
        variables: { username },
      }),
      next: { revalidate: 300 },
    });

    const payload = await res.json();
    if (!res.ok || payload.errors?.length) {
      return NextResponse.json(
        { success: false, error: payload.errors?.[0]?.message || "Unable to fetch LeetCode data." },
        { status: 502 }
      );
    }

    if (!payload.data?.matchedUser) {
      return NextResponse.json({ success: false, error: "LeetCode user not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        user: payload.data.matchedUser,
        recentAccepted: payload.data.recentAcSubmissionList || [],
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message || "Unable to connect to LeetCode." }, { status: 500 });
  }
}
