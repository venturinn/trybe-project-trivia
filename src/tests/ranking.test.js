import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import renderWithRouterAndStore from "./helpers/renderWithRouterAndStore";
import Ranking from "../pages/Ranking";

const { localStorageRankingWithThreeResults } = require("./mocks/localStorage");

const BTN_GO_HOME = "btn-go-home";

const PLAYER_1 = "player-name-0";
const PLAYER_2 = "player-name-1";
const PLAYER_3 = "player-name-2";

const SCORE_1 = "player-score-0";
const SCORE_2 = "player-score-1";
const SCORE_3 = "player-score-2";

describe("Testa a página <Ranking.js />.", () => {
  test("Ao clicar no botão 'Play Again' o jogador deve ser redirecionado para página de Login", () => {
    localStorage.setItem(
      "ranking",
      JSON.stringify(localStorageRankingWithThreeResults)
    );
    const { history } = renderWithRouterAndStore(<Ranking />, "/ranking");

    const playAgainButton = screen.getByTestId(BTN_GO_HOME);
    userEvent.click(playAgainButton);

    expect(history.location.pathname).toBe("/");
  });

  test("O ranking deve ser exibido de forma ordenada pelo score dos jogadores", () => {
    localStorage.setItem(
      "ranking",
      JSON.stringify(localStorageRankingWithThreeResults)
    );
    renderWithRouterAndStore(<Ranking />, "/ranking");

    const nameFirstPosition = screen.getByTestId(PLAYER_1);
    const nameSecondPosition = screen.getByTestId(PLAYER_2);
    const nameThirdPosition = screen.getByTestId(PLAYER_3);

    const scoreFirstPosition = screen.getByTestId(SCORE_1);
    const scoreSecondPosition = screen.getByTestId(SCORE_2);
    const scoreThirdPosition = screen.getByTestId(SCORE_3);

    expect(nameFirstPosition).toHaveTextContent("Name 02");
    expect(nameSecondPosition).toHaveTextContent("Name 03");
    expect(nameThirdPosition).toHaveTextContent("Name 01");

    expect(scoreFirstPosition).toHaveTextContent(350);
    expect(scoreSecondPosition).toHaveTextContent(300);
    expect(scoreThirdPosition).toHaveTextContent(50);
  });
});
