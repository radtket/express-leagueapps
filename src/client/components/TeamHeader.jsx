import React from "react";
import styled, { css } from "styled-components";
import { get } from "lodash";

const TeamColors = {
  2210410: {
    primary: "#00BEFE",
    secondary: "#000000",
    text: "#FFFFFF",
  },
  2210413: {
    primary: "#FF9900",
    secondary: "#7ABA05",
    text: "#000000",
  },
  2210416: {
    primary: "#D12631",
    secondary: "#FFFFFF",
    text: "#1E1B1B",
  },
  2210419: {
    primary: "#8DBE23",
    secondary: "#231F20",
    text: "#FFFFFF",
  },
  2210422: {
    primary: "#9EC803",
    secondary: "#35A701",
    text: "#0C2103",
  },
  2210425: {
    primary: "#B81A2C",
    secondary: "#FFBD00",
    text: "#000000",
  },
};

const StyledHeader = styled.header.withConfig({
  shouldForwardProp: (prop) => !["teamId"].includes(prop),
})`
  ${({ teamId }) => {
    const { primary, secondary, text } = get(TeamColors, [teamId], {});

    return css`
      background-color: ${primary};
      background:
        linear-gradient(
            to bottom,
            ${primary} 0%,
            ${primary} 38%,
            transparent 100%
          )
          no-repeat,
        ${secondary};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 0px;
      color: ${text};

      &::after {
        content: "";
        background: url("/img/logos/${teamId}.png") center center/100% no-repeat;
        opacity: 0.2;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: 0;
      }
      > * {
        z-index: 2;
      }
      img {
        height: 150px;
      }
    `;
  }}
`;

function TeamHeader({ teamId, teamName }) {
  return (
    <StyledHeader {...{ teamId }}>
      <div className="container">
        <img
          alt={`${teamName} Logo`}
          src={`/express-leagueapps/img/logos/${teamId}.png`}
        />
        <h2>{teamName}</h2>
        <h4 className="page-heading__title">Team Schedule</h4>
      </div>
    </StyledHeader>
  );
}

export default TeamHeader;
