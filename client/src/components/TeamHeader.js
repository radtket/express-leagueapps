import React from "react";
import { css } from "emotion";

const TeamHeader = ({
	primaryColor,
	secondaryColor,
	textColor,
	teamId,
	teamName
}) => {
	return (
		<header
			className={css`
      background-color: ${primaryColor};
      background: linear-gradient(
            to bottom,
            ${primaryColor} 0%,
            ${primaryColor} 38%,
            transparent 100%
          )
          no-repeat,
        ${secondaryColor};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 0px;
      color: ${textColor};
      &::after {
        content: "";
        background: url("/img/logos/${teamId}.png") center
          center/100% no-repeat;
        opacity: 0.2;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: 0;
      }
      >* {
        z-index: 2;
      }
      img {
        height: 150px;
      }
    `}
		>
			<div className="container">
				<img src={`/img/logos/${teamId}.png`} alt={`${teamName} Logo`} />
				<h2>{teamName}</h2>
				<h4 className="page-heading__title">Team Schedule</h4>
			</div>
		</header>
	);
};

export default TeamHeader;
