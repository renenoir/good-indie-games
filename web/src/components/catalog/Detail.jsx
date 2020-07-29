import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { format } from "date-fns";

import Loader from "../common/Loader";
import Rating from "../common/Rating";
import useUser from "../../hooks/useUser";
import useLoginOpen from "../../hooks/useLoginOpen";
import useFavorites from "../../hooks/useFavorites";
import { GRAY } from "../../styles/constants";
import List from "./List";

const Detail = () => {
  const [
    {
      id: gameId,
      name,
      cover,
      rating,
      platforms,
      themes,
      first_release_date,
      summary,
      websites,
      developers,
    },
    setData,
  ] = useState({});

  const [similarGames, setSimilarGames] = useState();

  const { id } = useParams();
  const { token } = useUser();
  const { setLoginOpen } = useLoginOpen();
  const { favoritesHashmap, addFavorite, removeFavorite } = useFavorites();

  const favorite = favoritesHashmap[id] !== undefined;

  useEffect(() => {
    if (!id) {
      setData({});
      return;
    }

    getData();

    async function getData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT}/gig/games/${id}`
        );

        const data = await response.json();

        if (!data) {
          throw new Error("Failed to fetch game data");
        }

        setData(data);

        if (!data.similar_games_in_db || !data.similar_games_in_db.length) {
          return;
        }

        try {
          const similarResponse = await fetch(
            `${
              process.env.REACT_APP_API_ENDPOINT
            }/gig/games?ids=${data.similar_games_in_db.join(",")}`
          );

          const similarGames = await similarResponse.json();

          if (!similarGames.results.length) {
            throw new Error("Failed to fetch similar games");
          }

          setSimilarGames(similarGames.results);
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [id]);

  if (!gameId) {
    return <Loader />;
  }

  return (
    <Wrapper>
      <Row>
        <Aside>
          <ImageSize>
            <Image src={cover && cover.replace(/t_thumb/g, "t_cover_big")} />
          </ImageSize>
          <Top>
            <Rating value={rating} />
            <DateText>{format(new Date(first_release_date), "y")}</DateText>
            <ToggleFavorite
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!token) {
                  setLoginOpen(true);
                  return;
                }

                if (favorite) {
                  removeFavorite(id);
                } else {
                  addFavorite(id);
                }
              }}
            >
              <Star
                viewBox="0 -10 511.98685 511"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="m510.652344 185.902344c-3.351563-10.367188-12.546875-17.730469-23.425782-18.710938l-147.773437-13.417968-58.433594-136.769532c-4.308593-10.023437-14.121093-16.511718-25.023437-16.511718s-20.714844 6.488281-25.023438 16.535156l-58.433594 136.746094-147.796874 13.417968c-10.859376 1.003906-20.03125 8.34375-23.402344 18.710938-3.371094 10.367187-.257813 21.738281 7.957031 28.90625l111.699219 97.960937-32.9375 145.089844c-2.410156 10.667969 1.730468 21.695313 10.582031 28.09375 4.757813 3.4375 10.324219 5.1875 15.9375 5.1875 4.839844 0 9.640625-1.304687 13.949219-3.882813l127.46875-76.183593 127.421875 76.183593c9.324219 5.609376 21.078125 5.097657 29.910156-1.304687 8.855469-6.417969 12.992187-17.449219 10.582031-28.09375l-32.9375-145.089844 111.699219-97.941406c8.214844-7.1875 11.351563-18.539063 7.980469-28.925781zm0 0"
                  fill={favorite ? "#ffc107" : GRAY}
                />
              </Star>
            </ToggleFavorite>
          </Top>
          <Platforms>{platforms.map(({ name }) => name).join(", ")}</Platforms>
          <Themes>{themes.map(({ name }) => name).join(", ")}</Themes>
        </Aside>
        <Content>
          <Name>{name}</Name>
          <Summary>{summary}</Summary>
          <p className="list-header">Developers:</p>
          <ul>
            {developers.map(({ id, name }) => (
              <li key={id}>{name}</li>
            ))}
          </ul>
          <p className="list-header">Links:</p>
          {websites && (
            <ul>
              {websites.map((link) => (
                <li key={link}>
                  <a href={link} target="_blank" rel="noreferrer noopener">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Content>
      </Row>
      <SimilarHeader>Similar games</SimilarHeader>
      {similarGames && (
        <List
          games={similarGames}
          addFavorite={async (id) => {
            await addFavorite(id);
          }}
          removeFavorite={async (id) => {
            await removeFavorite(id);
          }}
          favoritesHashmap={favoritesHashmap}
        />
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin: 1.75rem 0;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Aside = styled.aside`
  flex-basis: 300px;
  flex-shrink: 0;
`;

const Content = styled.div`
  margin-left: 1.75rem;
  flex-grow: 1;

  .list-header {
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  ul {
    margin: 0.5rem 0;
    padding: 0;
    list-style: none;
  }
`;

const ImageSize = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 100%;
  overflow: hidden;

  &:after {
    display: block;
    padding-bottom: 133%;
    content: "";
  }
`;

const Image = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const Name = styled.h1`
  margin: 0.5rem 0;
`;

const Summary = styled.p``;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
`;

const ToggleFavorite = styled.button`
  display: inline-block;
  background: none;
  border: none;
  padding: 0;
  margin: 0.75rem 0 0.5rem auto;
  cursor: pointer;

  &[disabled] {
    color: inherit;
  }
`;

const Star = styled.svg`
  display: block;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  path {
    transition: 0.2s ease-in-out;
  }
`;

const smallText = css`
  font-size: 0.875rem;
`;

const DateText = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.33);
  font-weight: bold;
  margin: 0;
  margin-left: 0.5rem;
`;

const Platforms = styled.p`
  ${smallText};
  margin: 0.5rem 0;
  color: rgba(0, 0, 0, 0.5);
`;

const Themes = styled.p`
  ${smallText};
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 0;
`;

const SimilarHeader = styled.h2`
  margin-top: 3rem;
`;

export default Detail;
