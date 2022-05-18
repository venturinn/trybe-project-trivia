import React from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import renderWithRouterAndStore from "./helpers/renderWithRouterAndStore";
import { waitFor } from "@testing-library/react";

const EMAIL_INPUT_TEST_ID = "input-gravatar-email";
const NAME_INPUT_TEST_ID = "input-player-name";
const BUTTON_PLAY_TEST_ID = "btn-play";
const BUTTON_SETTINGS_TEST_ID = "btn-settings";
const SETTINGS_TITLE_TEST_ID = "settings-title";

const VALID_EMAIL = "tomster@emberjs.com";
const VALID_NAME = "Diego Venturin";

describe("Testa a página <Login.js />.", () => {
  test("A primeira rota deve ser para /", () => {
    const { history } = renderWithRouterAndStore(<App />);
    expect(history.location.pathname).toBe("/");
  });

  test("A página deve ter um campo imput para o usuário inserir o email", () => {
    renderWithRouterAndStore(<App />);
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    expect(email).toBeInTheDocument();
  });

  test("A página deve ter um campo imput para o usuário inserir o nome", () => {
    renderWithRouterAndStore(<App />);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);
    expect(name).toBeInTheDocument();
  });

  test("A página deve ter um botão para o usuário iniciar o jogo", () => {
    renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    expect(btnPlay).toBeInTheDocument();
  });

  test("A página deve ter um botão para o usuário acessar as configurações", () => {
    renderWithRouterAndStore(<App />);
    const btnSettings = screen.getByTestId(BUTTON_SETTINGS_TEST_ID);
    expect(btnSettings).toBeInTheDocument();
  });

  test("O botão só deve estar habilitado com email e senha preenchidos", () => {
    renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    expect(btnPlay).toBeDisabled();

    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);

    userEvent.type(email, VALID_EMAIL);
    expect(btnPlay).toBeDisabled();

    userEvent.type(name, VALID_NAME);
    expect(btnPlay).not.toBeDisabled();
  });

  test("As informações do jogador dever ser armazenadas no Estado Global", () => {
    const { store } = renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(name, VALID_NAME);
    userEvent.click(btnPlay);

    expect(store.getState().player.name).toStrictEqual(VALID_NAME);
    expect(store.getState().player.gravatarEmail).toStrictEqual(VALID_EMAIL);
  });

  test("Ao clicar no botão Play o usuário deve ser redirecionado para /play", async () => {
    const { history } = renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(name, VALID_NAME);
    userEvent.click(btnPlay);

    await waitFor(() => expect(history.location.pathname).toBe("/play"));
  });

  test("Ao clicar no botão Settings o usuário deve ser redirecionado para /settings", () => {
    const { history } = renderWithRouterAndStore(<App />);
    const btnSettings = screen.getByTestId(BUTTON_SETTINGS_TEST_ID);

    userEvent.click(btnSettings);

    expect(history.location.pathname).toBe("/settings");
    const settingsTitle = screen.getByTestId(SETTINGS_TITLE_TEST_ID);
    expect(settingsTitle).toBeInTheDocument();
  });

  test("Ao clicar no botão Play um token deve ser requisitado na API e armazenado no estado global e localStorage", async () => {
    const { store } = renderWithRouterAndStore(<App />);
    const btnPlay = screen.getByTestId(BUTTON_PLAY_TEST_ID);
    const email = screen.getByTestId(EMAIL_INPUT_TEST_ID);
    const name = screen.getByTestId(NAME_INPUT_TEST_ID);

    const token =
      "f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6";
    const responseAPI = {
      response_code: 0,
      response_message: "Token Generated Successfully!",
      token,
    };

    jest.spyOn(global, "fetch");
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(responseAPI),
    });

    userEvent.type(email, VALID_EMAIL);
    userEvent.type(name, VALID_NAME);
    userEvent.click(btnPlay);

    expect(global.fetch).toBeCalledTimes(1);
    await waitFor(() => expect(store.getState().token).toStrictEqual(token));

    const tokenLocalStorage = localStorage.getItem("token");
    expect(tokenLocalStorage).toStrictEqual(token);
  });
});
