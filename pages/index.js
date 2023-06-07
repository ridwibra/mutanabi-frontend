import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faTwitter } from "@fortawesome/free-brands-svg-icons";
import dynamic from "next/dynamic";
const CurrentTime = dynamic(() => import("components/CurrentTime"), {
  ssr: false,
});

export default function Form() {
  const [word, setWord] = useState("");
  const [number, setNumber] = useState("");
  const [errors, setErrors] = useState({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const arabicToEnglishNumbers = (str) => {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[٠-٩]/g, (match) => arabicNumbers.indexOf(match));
  };

  const validate = () => {
    let errors = {};
    if (!word) {
      errors.word = {
        en: "Please enter an Arabic word",
        ar: "يرجى إدخال كلمة عربية",
      };
    } else if (word.trim().split(/\s+/).length > 1) {
      errors.word = {
        en: "Please enter only one word",
        ar: "يرجى إدخال كلمة واحدة فقط",
      };
    } else if (!/^[\u0600-\u06FF\s]+$/.test(word)) {
      errors.word = {
        en: "Please enter a word in Arabic",
        ar: "يرجى إدخال كلمة باللغة العربية",
      };
    }
    if (!number) {
      setNumber(1000);
    } else if (number < 1) {
      errors.number = {
        en: "Please enter a number greater than or equal to 1",
        ar: "يرجى إدخال رقم أكبر من أو يساوي 1",
      };
    } else if (!Number.isInteger(Number(number))) {
      errors.number = {
        en: "Please enter an integer",
        ar: "يرجى إدخال عدد صحيح",
      };
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleWordKeyPress = (event) => {
    if (!/^[\u0600-\u06FF\s]+$/.test(event.key)) {
      event.preventDefault();
    }
  };

  const handleNumberKeyPress = (event) => {
    if (!/^[0-9]+$/.test(event.key)) {
      event.preventDefault();
    }
  };
  const currentYear = new Date().getFullYear();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!validate()) return;
    try {
      const response = await fetch(
        `https://mutanabi-api.onrender.com/generate?seed=${word}&length=${number}`
      );
      const data = await response.json();
      setLoading(false);
      setOutput(data);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <main className="bg-white py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-3xl font-bold text-center mb-4 mt-5">
            Generate your own poem in the style of Al Mutanabi
            <div className="text-2xl" style={{ direction: "rtl" }}>
              اصنع قصيدتك الخاصة على طراز المتنبي
            </div>
          </h1>

          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-gray-100 p-4 rounded-md mt-10 shadow-md"
          >
            <label className="block text-lg font-semibold mb-2">
              Arabic Word
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyPress={handleWordKeyPress}
                onBlur={validate}
                placeholder="أدخل كلمة عربية"
                className={`block w-full mt-1 p-2 border rounded-md ${
                  errors.word ? "border-red-500" : "border-gray-300"
                }`}
                style={{ direction: "rtl" }}
                required
              />
              {errors.word && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.word.en} / {errors.word.ar}
                </p>
              )}
            </label>
            <label className="block text-lg font-semibold mb-2">
              Number
              <input
                type="text"
                value={number}
                onChange={(e) =>
                  setNumber(arabicToEnglishNumbers(e.target.value))
                }
                onKeyPress={handleNumberKeyPress}
                onBlur={validate}
                placeholder="أدخل رقم"
                className={`block w-full mt-1 p-2 border rounded-md ${
                  errors.number ? "border-red-500" : "border-gray-300"
                }`}
                style={{ textAlign: "right" }}
                required
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.number.en} / {errors.number.ar}
                </p>
              )}
            </label>
            <button
              type="submit"
              disabled={!word || !number || loading}
              className={`block w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-4 ${
                (!word || !number || loading) && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "...جار إنشاء قصيدة" : "توليد"}
            </button>
          </form>
          <p className="text-center mt-4">
            <CurrentTime />
          </p>
          {output && (
            <div className="output mt-4 bg-white p-4 rounded-md shadow-md">
              <p>{output}</p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-6">
          <div className="flex justify-center items-center space-x-12">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faWhatsapp} className="text-2xl mr-3" />
              <a href="https://wa.me/233548336362" className="hover:underline">
                +233548336362
              </a>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faTwitter} className="text-2xl mr-3" />
              <a
                href="https://twitter.com/RidwanIbraheem5"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                @RidwanIbraheem5
              </a>
            </div>
          </div>
          <hr className="my-6" />
          <div className="text-center">
            <p>© {new Date().getFullYear()} </p>
          </div>
        </div>
      </footer>
      ;
    </>
  );
}
