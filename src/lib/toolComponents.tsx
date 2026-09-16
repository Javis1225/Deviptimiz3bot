import type { ComponentType } from 'react'

import SlugGenerator from '../tools/text/SlugGenerator'
import WordCounter from '../tools/text/WordCounter'
import CaseConverter from '../tools/text/CaseConverter'
import RemoveDuplicateLines from '../tools/text/RemoveDuplicateLines'
import LineCounter from '../tools/text/LineCounter'
import TextDiffChecker from '../tools/text/TextDiffChecker'
import RandomStringGenerator from '../tools/text/RandomStringGenerator'
import LoremIpsumGenerator from '../tools/text/LoremIpsumGenerator'
import MarkdownToHtml from '../tools/text/MarkdownToHtml'
import HtmlToMarkdown from '../tools/text/HtmlToMarkdown'
import TextSorter from '../tools/text/TextSorter'
import FindAndReplace from '../tools/text/FindAndReplace'
import MorseCodeConverter from '../tools/text/MorseCodeConverter'
import HtmlTagStripper from '../tools/text/HtmlTagStripper'
import WordFrequencyCounter from '../tools/text/WordFrequencyCounter'
import ReverseTextGenerator from '../tools/text/ReverseTextGenerator'
import WhitespaceRemover from '../tools/text/WhitespaceRemover'

import HexToRgb from '../tools/design/HexToRgb'
import RgbToHex from '../tools/design/RgbToHex'
import ColorPaletteGenerator from '../tools/design/ColorPaletteGenerator'
import CssGradientGenerator from '../tools/design/CssGradientGenerator'
import SvgToPng from '../tools/design/SvgToPng'
import PngToJpeg from '../tools/design/PngToJpeg'
import CssBoxShadowGenerator from '../tools/design/CssBoxShadowGenerator'
import ImageAspectRatioCalculator from '../tools/design/ImageAspectRatioCalculator'
import FaviconGenerator from '../tools/design/FaviconGenerator'
import ImageResizer from '../tools/design/ImageResizer'
import CssBorderRadiusGenerator from '../tools/design/CssBorderRadiusGenerator'
import ColorContrastChecker from '../tools/design/ColorContrastChecker'
import ImageColorPicker from '../tools/design/ImageColorPicker'
import PlaceholderImageGenerator from '../tools/design/PlaceholderImageGenerator'
import PercentageCalculator from '../tools/design/PercentageCalculator'
import AgeCalculator from '../tools/design/AgeCalculator'
import CompoundInterestCalculator from '../tools/design/CompoundInterestCalculator'
import UnixTimestampConverter from '../tools/design/UnixTimestampConverter'
import DateDifferenceCalculator from '../tools/design/DateDifferenceCalculator'
import PasswordStrengthMeter from '../tools/design/PasswordStrengthMeter'
import RandomNumberPicker from '../tools/design/RandomNumberPicker'

import JsonFormatter from '../tools/dev/JsonFormatter'
import JsonToXml from '../tools/dev/JsonToXml'
import XmlToJson from '../tools/dev/XmlToJson'
import Base64Tool from '../tools/dev/Base64Tool'
import UrlEncoderTool from '../tools/dev/UrlEncoderTool'
import Md5Generator from '../tools/dev/Md5Generator'
import Sha256Generator from '../tools/dev/Sha256Generator'
import BcryptGenerator from '../tools/dev/BcryptGenerator'
import JsMinifier from '../tools/dev/JsMinifier'
import CssMinifier from '../tools/dev/CssMinifier'
import HtmlMinifier from '../tools/dev/HtmlMinifier'
import SqlFormatter from '../tools/dev/SqlFormatter'
import RegexTester from '../tools/dev/RegexTester'
import JwtDecoder from '../tools/dev/JwtDecoder'
import CronGenerator from '../tools/dev/CronGenerator'
import YamlToJson from '../tools/dev/YamlToJson'
import JsonToCsv from '../tools/dev/JsonToCsv'
import LinkExtractor from '../tools/dev/LinkExtractor'
import QrCodeGenerator from '../tools/dev/QrCodeGenerator'
import Sha1Generator from '../tools/dev/Sha1Generator'
import Sha512Generator from '../tools/dev/Sha512Generator'
import ApiKeyGenerator from '../tools/dev/ApiKeyGenerator'
import SecurityTxtGenerator from '../tools/dev/SecurityTxtGenerator'
import CorsGenerator from '../tools/dev/CorsGenerator'
import XssSanitizer from '../tools/dev/XssSanitizer'
import SvgOptimizer from '../tools/dev/SvgOptimizer'
import CompressionCalculator from '../tools/dev/CompressionCalculator'
import LazyLoadGenerator from '../tools/dev/LazyLoadGenerator'
import CriticalCssGenerator from '../tools/dev/CriticalCssGenerator'
import FontFaceGenerator from '../tools/dev/FontFaceGenerator'
import StorageCleaner from '../tools/dev/StorageCleaner'

import TitleGenerator from '../tools/youtube/TitleGenerator'
import TagExtractor from '../tools/youtube/TagExtractor'
import ThumbnailPreviewer from '../tools/youtube/ThumbnailPreviewer'
import ChannelIdFinder from '../tools/youtube/ChannelIdFinder'
import DescriptionGenerator from '../tools/youtube/DescriptionGenerator'
import MoneyCalculator from '../tools/youtube/MoneyCalculator'
import EmbedGenerator from '../tools/youtube/EmbedGenerator'
import RegionRestrictionChecker from '../tools/youtube/RegionRestrictionChecker'
import CommentPicker from '../tools/youtube/CommentPicker'
import SubscriberCounter from '../tools/youtube/SubscriberCounter'
import TimestampLinkMaker from '../tools/youtube/TimestampLinkMaker'
import SearchTrendAnalyzer from '../tools/youtube/SearchTrendAnalyzer'
import AuditChecklist from '../tools/youtube/AuditChecklist'
import ShortsScriptTimer from '../tools/youtube/ShortsScriptTimer'
import MetadataViewer from '../tools/youtube/MetadataViewer'

import MobileFriendlyTester from '../tools/seo/MobileFriendlyTester'
import SecurityHeaderChecker from '../tools/seo/SecurityHeaderChecker'

// Keyed by ToolMeta.componentKey from src/data/toolRegistry.ts.
// Adding a new tool: implement the component, import it here, add one line,
// then flip `implemented: true` for that tool in scripts/generate_catalog.py
// and re-run `npm run generate:catalog`.
export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  SlugGenerator,
  WordCounter,
  CaseConverter,
  RemoveDuplicateLines,
  LineCounter,
  TextDiffChecker,
  RandomStringGenerator,
  LoremIpsumGenerator,
  MarkdownToHtml,
  HtmlToMarkdown,
  TextSorter,
  FindAndReplace,
  MorseCodeConverter,
  HtmlTagStripper,
  WordFrequencyCounter,
  ReverseTextGenerator,
  WhitespaceRemover,
  HexToRgb,
  RgbToHex,
  ColorPaletteGenerator,
  CssGradientGenerator,
  SvgToPng,
  PngToJpeg,
  CssBoxShadowGenerator,
  ImageAspectRatioCalculator,
  FaviconGenerator,
  ImageResizer,
  CssBorderRadiusGenerator,
  ColorContrastChecker,
  ImageColorPicker,
  PlaceholderImageGenerator,
  PercentageCalculator,
  AgeCalculator,
  CompoundInterestCalculator,
  UnixTimestampConverter,
  DateDifferenceCalculator,
  PasswordStrengthMeter,
  RandomNumberPicker,
  JsonFormatter,
  JsonToXml,
  XmlToJson,
  Base64Tool,
  UrlEncoderTool,
  Md5Generator,
  Sha256Generator,
  BcryptGenerator,
  JsMinifier,
  CssMinifier,
  HtmlMinifier,
  SqlFormatter,
  RegexTester,
  JwtDecoder,
  CronGenerator,
  YamlToJson,
  JsonToCsv,
  LinkExtractor,
  QrCodeGenerator,
  Sha1Generator,
  Sha512Generator,
  ApiKeyGenerator,
  SecurityTxtGenerator,
  CorsGenerator,
  XssSanitizer,
  SvgOptimizer,
  CompressionCalculator,
  LazyLoadGenerator,
  CriticalCssGenerator,
  FontFaceGenerator,
  StorageCleaner,
  TitleGenerator,
  TagExtractor,
  ThumbnailPreviewer,
  ChannelIdFinder,
  DescriptionGenerator,
  MoneyCalculator,
  EmbedGenerator,
  RegionRestrictionChecker,
  CommentPicker,
  SubscriberCounter,
  TimestampLinkMaker,
  SearchTrendAnalyzer,
  AuditChecklist,
  ShortsScriptTimer,
  MetadataViewer,
  MobileFriendlyTester,
  SecurityHeaderChecker,
}
