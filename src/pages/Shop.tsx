import { getAllAuthors } from "../api/authors";
import { Author } from "../api/authors/types/authors.type";
import { getAllBooks } from "../api/books";
import { Book } from "../api/books/types/books.type";
import { getAllStores } from "../api/stores";
import { Store } from "../api/stores/types/store.type";
import { Card } from "../components/Card";
import HorizontalCarouselHOC from "../components/HorizontalCarouselHOC";
import { useEffect, useState } from "react";
import StoresIcon from "../components/icons/StoresIcon";
import AuthorImage from "../assets/author.png";

export const Shop = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const storesData = await getAllStores({ page: 1, limit: 4 });
      const authorsData = await getAllAuthors({ page: 1, limit: 4 });
      const booksData = await getAllBooks({ page: 1, limit: 4 });

      setStores(storesData.data);
      setAuthors(authorsData.data);
      setBooks(booksData.data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-[22px]">
      {/* Browse by Stores Section */}
      <section>
        <div className="flex justify-between items-center mb-[22px]">
          <h2 className="text-2xl font-medium text-black">Browse by Stores</h2>
          <button className="bg-[#D86128] text-white p-2 rounded text-base font-medium">
            View All
          </button>
        </div>
        <HorizontalCarouselHOC>
          {stores.map((store) => (
            <Card
              key={store.id}
              leftComponent={
                <div className="flex justify-center items-center bg-[#FFEBE1] w-[125px] h-full text-[#FF8C87] rounded-[8px]">
                  <StoresIcon width={58} height={58} />
                </div>
              }
              title={store.name}
              description={store.address_1}
            />
          ))}
        </HorizontalCarouselHOC>
      </section>

      {/* Browse by Authors Section */}
      <section>
        <div className="flex justify-between items-center mb-[22px]">
          <h2 className="text-2xl font-medium text-black">Browse by Authors</h2>
          <button className="bg-[#D86128] text-white p-2 rounded text-base font-medium">
            View All
          </button>
        </div>
        <HorizontalCarouselHOC>
          {authors.map((author) => (
            <Card
              key={author.id}
              leftComponent={
                <div className="w-[125px] h-full rounded-[8px]">
                  <img
                    src={AuthorImage}
                    alt={author.first_name}
                    className="w-full h-full object-cover rounded-[8px]"
                  />
                </div>
              }
              title={author.first_name}
              description={author.nationality}
            />
          ))}
        </HorizontalCarouselHOC>
      </section>

      {/* Browse by Books Section */}
      <section>
        <div className="flex justify-between items-center mb-[22px]">
          <h2 className="text-2xl font-medium text-black">Browse by Books</h2>
          <button className="bg-[#D86128] text-white p-2 rounded text-base font-medium">
            View All
          </button>
        </div>
        <HorizontalCarouselHOC>
          {books.map((book) => (
            <Card
              key={book.id}
              leftComponent={
                <div className="flex justify-center items-center text-center bg-[#FFEBE1] text-[14px] w-[125px] h-full">
                  {" "}
                  <span>{book.name}</span>
                </div>
              }
              title={book.name}
              description={book.format}
            />
          ))}
        </HorizontalCarouselHOC>
      </section>
    </div>
  );
};
