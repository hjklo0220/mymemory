export interface Sm2Input {
  easeFactor: number;
  interval: number;
  repetitions: number;
  rating: number; // 0=again, 3=hard, 5=good
}

export interface Sm2Result {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReviewAt: Date;
}

export function calculateSm2(input: Sm2Input): Sm2Result {
  const { rating } = input;
  let { easeFactor, interval, repetitions } = input;

  if (rating === 0) {
    // again: 내일 다시
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
    repetitions += 1;
  }

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return { easeFactor, interval, repetitions, nextReviewAt };
}
