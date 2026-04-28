//import { useFeatures } from "app/core/services/featuresService";
import { Card } from "compositions";
import { useMediaQuery } from "hooks";
import { IconInfo } from "icons";
import { Flex, FlexItem, Section } from "layout";
import {
  Button,
  ButtonGroup,
  Image,
  Text,
  TextContentHeading,
  TextContentTitle,
  TextHeading,
} from "primitives";

export default function AboutPage() {
  //const { data: features, isLoading, isError } = useFeatures();
  const { isMobile } = useMediaQuery();
  const sectionPadding = isMobile ? "600" : "1600";
  const flexGap = isMobile ? "600" : "1200";
  //const cardGap = isMobile ? "600" : "1600";

  return (
    <>
      {/* Hero Section */}
      <Section
        padding={isMobile ? "600" : "4000"}
        variant="image"
        src="https://picsum.photos/seed/about-hero/1920/1080"
      >
        <Flex
          container
          direction="column"
          gap={flexGap}
          alignPrimary="center"
          alignSecondary="center"
        >
          <TextContentTitle
            align="center"
            title="Discover Our Story"
            subtitle="Building innovative solutions for tomorrow's challenges"
          />
          <ButtonGroup align="center">
            <Button variant="subtle" size="medium">
              Learn More
            </Button>
            <Button variant="primary" size="medium">
              Get Started
            </Button>
          </ButtonGroup>
        </Flex>
      </Section>

      {/* Two Images Panel */}
      <Section padding={sectionPadding}>
        <Flex
          container
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? "600" : "1200"}
          alignPrimary="center"
          alignSecondary="center"
        >
          <Flex style={{ width: isMobile ? "100%" : "512px", height: "350px" }}>
            <Image
              src="https://picsum.photos/seed/about-image-1/512/350"
              alt="Innovation in action"
              aspectRatio="fill"
              size="fill"
            />
          </Flex>
          <Flex style={{ width: isMobile ? "100%" : "512px", height: "350px" }}>
            <Image
              src="https://picsum.photos/seed/about-image-2/512/350"
              alt="Team collaboration"
              aspectRatio="fill"
              size="fill"
            />
          </Flex>
        </Flex>
      </Section>
      {/* Features Cards Section */}
      <Section padding="1600">
        <Flex container gap="1200" direction="column" alignSecondary="stretch">
          <TextContentHeading heading="Heading" subheading="Subheading" />
          <FlexItem>
            <Flex wrap gap="1600" type="third">
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
              <Card asset={<IconInfo />} direction="horizontal">
                <TextHeading>Title</TextHeading>
                <Text>
                  Body text for whatever you’d like to say. Add main takeaway
                  points, quotes, anecdotes, or even a very very short
                  story.{" "}
                </Text>
              </Card>
            </Flex>
          </FlexItem>
        </Flex>
      </Section>
    </>
  );
}
