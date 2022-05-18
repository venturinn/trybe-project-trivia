import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Feedback from "../pages/Feedback";
import renderWithRouterAndStore from "./helpers/renderWithRouterAndStore";

const {
  feedbackInitialStateTwoAssertions,
  feedbackInitialStateFourAssertions,
  feedbackInitialStateThreeAssertions,
} = require("./mocks/feedback");

const FEEDBACK_TEST = "feedback-text";
const TOTAL_SCORE = "feedback-total-score";
const TOTAL_QUESTIONS = "feedback-total-question";

const BTN_PLAY_AGAIN = "btn-play-again";
const BTN_RANKING = "btn-ranking";

const HEADER_NAME = "header-player-name";
const HEADER_SCORE = "header-score";

const VALID_NAME = "Diego Venturin - Turma XP - Tribo A";

describe("Testa a página <Feedback.js />.", () => {
  test("A página deve ter um Header com as informações da pessoa jogadora", () => {
    renderWithRouterAndStore(
      <Feedback />,
      "/feedback",
      feedbackInitialStateFourAssertions
    );

    const headerName = screen.getByTestId(HEADER_NAME);
    const headerScore = screen.getByTestId(HEADER_SCORE);

    expect(headerName).toBeInTheDocument();
    expect(headerScore).toBeInTheDocument();
    expect(headerName).toHaveTextContent(VALID_NAME);
    expect(headerScore).toHaveTextContent(221);
  });

  test("Ao clicar no botão 'Play Again' o jogador deve ser redirecionado para página de Login", () => {
    const { history } = renderWithRouterAndStore(<Feedback />, "/feedback");

    const playAgainButton = screen.getByTestId(BTN_PLAY_AGAIN);
    userEvent.click(playAgainButton);

    expect(history.location.pathname).toBe("/");
  });

  test("Ao clicar no botão 'Go to Ranking' o jogador deve ser redirecionado para página de Ranking", () => {
    const { history } = renderWithRouterAndStore(<Feedback />, "/feedback");

    const rankingButton = screen.getByTestId(BTN_RANKING);
    userEvent.click(rankingButton);

    expect(history.location.pathname).toBe("/ranking");
  });

  test("A pontuação do jogador deve ser exibida corretamente", () => {
    renderWithRouterAndStore(
      <Feedback />,
      "/feedback",
      feedbackInitialStateFourAssertions
    );

    const playerScore = screen.getByTestId(TOTAL_SCORE);
    const playerQuestions = screen.getByTestId(TOTAL_QUESTIONS);

    expect(playerScore).toBeInTheDocument();
    expect(playerQuestions).toBeInTheDocument();
    expect(playerScore).toHaveTextContent(221);
    expect(playerQuestions).toHaveTextContent(4);
  });

  test("A mensagem 'Could be better...' deve ser exibida para um acerto menor que 3 questões", () => {
    renderWithRouterAndStore(
      <Feedback />,
      "/feedback",
      feedbackInitialStateTwoAssertions
    );

    const feedbackMessage = screen.getByTestId(FEEDBACK_TEST);
    expect(feedbackMessage).toHaveTextContent("Could be better...");
  });

  test("A mensagem 'Well Done!' deve ser exibida para um acerto de igual a 3 questões", () => {
    renderWithRouterAndStore(
      <Feedback />,
      "/feedback",
      feedbackInitialStateThreeAssertions
    );

    const feedbackMessage = screen.getByTestId(FEEDBACK_TEST);
    expect(feedbackMessage).toHaveTextContent("Well Done!");
  });

  test("A mensagem 'Well Done!' deve ser exibida para um acerto maior que 3 questões", () => {
    renderWithRouterAndStore(
      <Feedback />,
      "/feedback",
      feedbackInitialStateFourAssertions
    );

    const feedbackMessage = screen.getByTestId(FEEDBACK_TEST);
    expect(feedbackMessage).toHaveTextContent("Well Done!");
  });
});
