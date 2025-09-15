(global as any).fetch = async () => {
  return { ok: true, status: 200, statusText: "OK", headers: { get: () => null } };
};