/**
 * @jest-environment jsdom
 */

import { render } from "@testing-library/react";

import Footer from "../components/Footer/Footer";

describe("Footer", () => {
    it("Should render Footer component", () => {
        const { getByText } = render(<Footer />);
        const name = getByText("The Prayer Wall 2021");
        expect(name).toBeTruthy();
    });
});
