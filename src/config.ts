import dotenv from 'dotenv';

// NODE_ENV에 따라 다른 .env 파일을 로드
const envFile = process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev';

// dotenv.config() 호출하여 환경 변수 설정
const result = dotenv.config({ path: envFile });

if (result.error) {
  throw result.error;
}

export default result.parsed;
