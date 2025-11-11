import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
// ... additional imports for models, etc.
describe('AuthService', () => {
    let service: AuthService;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService],
        }).compile();
        service = module.get<AuthService>(AuthService);
    });

    it('should login and issue tokens', async () => {
        // ...
    });
    it('should detect refresh reuse/theft and revoke all', async () => {
        // ...
    });
    it('should logout and revoke token', async () => {
        // ...
    });
});
