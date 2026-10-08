import Router from './app/core/Router.js';
import FeedbackController from './app/controllers/FeedbackController.js';
import AuthController from './app/controllers/AuthController.js';

const router = new Router();

router.get('/', [FeedbackController, 'create']);
router.post('/feedback/cadastrar', [FeedbackController, 'store']);

router.get('/login', [AuthController, 'form']);
router.post('/login', [AuthController, 'login']);
router.get('/logout', [AuthController, 'logout']);

router.get('/feedbacks', [FeedbackController, 'index'], { protegida: true });
router.get('/feedbacks/{idFeedback}', [FeedbackController, 'show'], { protegida: true });
router.put('/feedback/atualizar', [FeedbackController, 'atualizar'], { protegida: true });

export default router;
