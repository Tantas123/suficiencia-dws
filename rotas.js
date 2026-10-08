import Router from './app/core/Router.js';
import FeedbackController from './app/controllers/FeedbackController.js';

const router = new Router();

router.get('/', [FeedbackController, 'create']);
router.post('/feedback/cadastrar', [FeedbackController, 'store']);

router.get('/feedbacks', [FeedbackController, 'index']);
router.get('/feedbacks/{idFeedback}', [FeedbackController, 'show']);

export default router;
