import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
jest.spyOn(console, 'log').mockImplementation(() => {});
