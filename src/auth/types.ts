export type JwtPayload = {
  id: number;
  role: string;
};

export type JwtPayloadWithRefreshToken = JwtPayload & {refreshToken: string}