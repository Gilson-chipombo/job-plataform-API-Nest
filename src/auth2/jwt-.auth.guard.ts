import { AuthGuard } from "@nestjs/passport";

// Este guard ja  usa estrategia automaticamente
export class JwtAuthGuard extends AuthGuard('jwt'){}