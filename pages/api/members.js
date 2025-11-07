// ✅ Get all members for a state
export async function getMembersByState(state) {
  // We fetch the congressional list (up to 250 members)
  const data = await apiGet(`/member?limit=250&page=1`);

  // Congress API returns members under `members.member`
  const members = data?.members?.member || [];

  // Filter members by state code
  return members.filter(
    (m) =>
      m.state?.toUpperCase() === state.toUpperCase() ||
      m.stateCode?.toUpperCase() === state.toUpperCase()
  );
}
