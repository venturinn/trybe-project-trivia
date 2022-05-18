import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import Game from "../pages/Game";
import renderWithRouterAndStore from "./helpers/renderWithRouterAndStore";
import { waitFor } from "@testing-library/react";

const {
  questionsResponse,
  expiredQuestionsResponse,
} = require("./mocks/questions");

const {
  localStorageRankingWithTwoResults,
  localStorageRankingWithOneResult,
} = require("./mocks/localStorage");

const { playerState } = require("./mocks/player");

const mockTriviaApiWithValidToken = () => {
  jest.spyOn(global, "fetch");
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(questionsResponse),
  });
};

const mockTriviaApiWithInvalidToken = () => {
  jest.spyOn(global, "fetch");
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue(expiredQuestionsResponse),
  });
};

const EMAIL_INPUT_TEST_ID = "input-gravatar-email";
const NAME_INPUT_TEST_ID = "input-player-name";
const BUTTON_PLAY_TEST_ID = "btn-play";

const HEADER_PICTURE = "header-profile-picture";
const GRAVATAR_HASH = "0cf15665a9146ba852bf042b0652780a";

const HEADER_NAME = "header-player-name";
const HEADER_SCORE = "header-score";

const CATEGORY = "question-category";
const QUESTION_TEXT = "question-text";
const CORRECT_ANSWER = "correct-answer";
const WRONG_ANSWER = "wrong-answer-1";
const BTN_NEXT = "btn-next";
const TIMER = "timer";

const VALID_EMAIL = "tomster@emberjs.com";
const VALID_NAME = "Diego Venturin - Turma XP - Tribo A";

describe("Testa a página <Game.js />.", () => {
  test("Após 30 segundos, o botão Next deve ser renderizado e as alternativas desabilitadas", async () => {
    jest.setTimeout(45000);
    mockTriviaApiWithValidToken();
    renderWithRouterAndStore(<Game />, "/play", playerState);

    const nextButton = screen.queryByText("Next");
    expect(nextButton).toBeNull();
    await new Promise((r) => setTimeout(r, 31000));

    const correct_answer = screen.getByTestId(CORRECT_ANSWER);
    expect(correct_answer).toBeDisabled();

    const nextButton2 = screen.getByTestId(BTN_NEXT);
    expect(nextButton2).toBeInTheDocument();
  });

  test("A página deve ter um Header com as informações da pessoa jogadora e placar zerado", async () => {
    mockTriviaApiWithValidToken();
    renderWithRouterAndStore(<Game />, "/play", playerState);

    const headerName = await waitFor(() => screen.getByTestId(HEADER_NAME));
    const headerScore = screen.getByTestId(HEADER_SCORE);

    expect(headerName).toBeInTheDocument();
    expect(headerScore).toBeInTheDocument();
    expect(headerName).toHaveTextContent(VALID_NAME);
    expect(headerScore).toHaveTextContent(0);
  });

  test("Apenas uma pergunta deve ser carregada por vez", async () => {
    mockTriviaApiWithValidToken();
    renderWithRouterAndStore(<Game />, "/play", playerState);

    const category = await waitFor(() => screen.getByTestId(CATEGORY));
    const question_text = screen.getByTestId(QUESTION_TEXT);
    const correct_answer = screen.getByTestId(CORRECT_ANSWER);
    const wrong_answer = screen.getByTestId(WRONG_ANSWER);

    expect(category).toBeInTheDocument();
    expect(question_text).toBeInTheDocument();
    expect(correct_answer).toBeInTheDocument();
    expect(wrong_answer).toBeInTheDocument();

    expect(category).toHaveTextContent("Entertainment: Video Games");
    expect(question_text).toHaveTextContent(
      "What was the name of the hero in the 80s animated video game"
    );
    expect(correct_answer).toHaveTextContent("Dirk the Daring");
  });

  test("A pagina deve ser redirecionada para o login quando o token estiver vencido", async () => {
    mockTriviaApiWithInvalidToken();
    const { history } = renderWithRouterAndStore(
      <Game />,
      "/play",
      playerState
    );

    await waitFor(() => expect(history.location.pathname).toBe("/"));
  });

  test('O boton "Next" deve ser habilitado após a resposta do jogador', async () => {
    mockTriviaApiWithValidToken();
    renderWithRouterAndStore(<Game />, "/play", playerState);

    const nextButton = screen.queryByText("Next");
    expect(nextButton).toBeNull();

    const correct_answer = await waitFor(() =>
      screen.getByTestId(CORRECT_ANSWER)
    );
    userEvent.click(correct_answer);

    const nextButton2 = screen.queryByText("Next");
    expect(nextButton2).toBeInTheDocument();
  });

  test("Após responder 05 perguntas o jogador deve ser redirecionado para a página de Feedback e o resultado savo no localStorage e Global State", async () => {
    mockTriviaApiWithValidToken();
    const { history, store } = renderWithRouterAndStore(
      <Game />,
      "/play",
      playerState
    );

    const correct_answer = await waitFor(() =>
      screen.getByTestId(CORRECT_ANSWER)
    );
    const timer = screen.getByTestId(TIMER);
    expect(correct_answer).toHaveTextContent("Dirk the Daring");
    userEvent.click(correct_answer);
    expect(correct_answer).toBeDisabled();

    const nextButton = screen.getByTestId(BTN_NEXT);
    userEvent.click(nextButton);

    const correct_answer2 = screen.getByTestId(CORRECT_ANSWER);
    expect(correct_answer2).toHaveTextContent("Hamlet");
    userEvent.click(correct_answer2);
    expect(correct_answer2).toBeDisabled();

    const nextButton2 = screen.getByTestId(BTN_NEXT);
    expect(nextButton2).toBeInTheDocument();
    userEvent.click(nextButton2);

    const correct_answer3 = screen.getByTestId(CORRECT_ANSWER);
    expect(correct_answer3).toHaveTextContent("False");
    userEvent.click(correct_answer3);
    expect(correct_answer3).toBeDisabled();

    const nextButton3 = screen.getByTestId(BTN_NEXT);
    expect(nextButton3).toBeInTheDocument();
    userEvent.click(nextButton3);

    const correct_answer4 = screen.getByTestId(CORRECT_ANSWER);
    expect(correct_answer4).toHaveTextContent("True");
    userEvent.click(correct_answer4);
    expect(correct_answer4).toBeDisabled();

    const nextButton4 = screen.getByTestId(BTN_NEXT);
    expect(nextButton4).toBeInTheDocument();
    userEvent.click(nextButton4);

    const correct_answer5 = screen.getByTestId(CORRECT_ANSWER);
    expect(correct_answer5).toHaveTextContent("Junji Ito");
    userEvent.click(correct_answer5);
    expect(correct_answer5).toBeDisabled();

    const nextButton5 = screen.getByTestId(BTN_NEXT);
    expect(nextButton5).toBeInTheDocument();
    userEvent.click(nextButton5);

    await waitFor(() => expect(history.location.pathname).toBe("/feedback"));

    const rankingLocalStorage = JSON.parse(localStorage.getItem("ranking"));
    expect(rankingLocalStorage).toStrictEqual(localStorageRankingWithOneResult);

    await waitFor(() =>
      expect(store.getState().player.score).toStrictEqual(350)
    );
  });

  test("A endereço da imagem gravatar deve ser gerada corretamente", async () => {
    mockTriviaApiWithValidToken();
    const { history } = renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(name, VALID_NAME);
    userEvent.click(btnPlay);

    const headerPicture = await waitFor(() =>
      screen.getByTestId(HEADER_PICTURE)
    );

    expect(headerPicture).toBeInTheDocument();
    expect(headerPicture.src).toContain(GRAVATAR_HASH);
  });

  test("Os resultados deve ser armazenado no localStorage de forma cumulativa", async () => {
    localStorage.setItem(
      "ranking",
      JSON.stringify(localStorageRankingWithOneResult)
    );

    mockTriviaApiWithValidToken();
    const { history } = renderWithRouterAndStore(
      <Game />,
      "/play",
      playerState
    );

    const correct_answer = await waitFor(() =>
      screen.getByTestId(CORRECT_ANSWER)
    );
    userEvent.click(correct_answer);

    const nextButton = screen.getByTestId(BTN_NEXT);
    userEvent.click(nextButton);

    const correct_answer2 = screen.getByTestId(CORRECT_ANSWER);
    userEvent.click(correct_answer2);

    const nextButton2 = screen.getByTestId(BTN_NEXT);
    expect(nextButton2).toBeInTheDocument();
    userEvent.click(nextButton2);

    const correct_answer3 = screen.getByTestId(CORRECT_ANSWER);
    userEvent.click(correct_answer3);

    const nextButton3 = screen.getByTestId(BTN_NEXT);
    expect(nextButton3).toBeInTheDocument();
    userEvent.click(nextButton3);

    const correct_answer4 = screen.getByTestId(CORRECT_ANSWER);
    userEvent.click(correct_answer4);

    const nextButton4 = screen.getByTestId(BTN_NEXT);
    expect(nextButton4).toBeInTheDocument();
    userEvent.click(nextButton4);

    const correct_answer5 = screen.getByTestId(CORRECT_ANSWER);
    userEvent.click(correct_answer5);

    const nextButton5 = screen.getByTestId(BTN_NEXT);
    expect(nextButton5).toBeInTheDocument();
    userEvent.click(nextButton5);

    await waitFor(() => expect(history.location.pathname).toBe("/feedback"));

    const rankingLocalStorage = JSON.parse(localStorage.getItem("ranking"));
    expect(rankingLocalStorage).toStrictEqual(
      localStorageRankingWithTwoResults
    );
  });
});
