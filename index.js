import _ from 'lodash';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';
import React, { Component, PropTypes } from 'react';
import ChevronRight from 'components/icons/ChevronRight';
import Timestamp from 'components/custom/griffin/Timestamp';
import ComponentTitle from '../../shared/ComponentTitle';

const GRID_ITEM_HEIGHT = 200;
const HERO_ITEM_HEIGHT = 400;

const imagePlacementType = {
  LEFT: 'left',
  RIGHT: 'right'
};

const layoutType = {
  HERO: 'hero',
  GRID: 'grid'
};

const itemType = {
  HERO: 'hero',
  GRID: 'grid'
};

class SideBySideArticle extends Component {
  static propTypes = {
    FRN_rawResponses: PropTypes.array,
    title: PropTypes.string,
    titleColor: PropTypes.string,
    textColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    imagePlacement: PropTypes.string,
    layout: PropTypes.string,
    showTimestamp: PropTypes.bool,
    showReadMore: PropTypes.bool,
    showPill: PropTypes.bool,
    padding: PropTypes.number,
    totalNumberOfItems: PropTypes.number
  }

  static defaultProps = {
    imagePlacement: imagePlacementType.LEFT,
    layout: layoutType.GRID,
    titleColor: '#FFFFFF',
    textColor: '#FFFFFF',
    backgroundColor: '#000000',
    showTimestamp: true,
    showReadMore: true,
    totalNumberOfItems: 7
  }

  _buildListItems(items) {
    const {
      textColor,
      padding
    } = this.props;
    return (
      <ul className="CategoryGrid-listItem " style={{paddingLeft: padding}}>
        {items.map((item, index) => {
            const {
              headline = '',
              surfaceable: [ { type: featureType = '' } = {} ] = [],
              type = ''
            } = item;
            const isVideoAttached = featureType.toLowerCase() === 'clip' || type.toLowerCase() === 'clip';
            const headlineSmallClassName = classNames({
              'CategoryGrid-headlineSmall-videoThumnail': isVideoAttached
            });
            return (
              <CategoryLink item={item} key={index} >
                <li className={headlineSmallClassName} style={{color: textColor}}>{headline}</li>
              </CategoryLink>
            );
          })
        }
      </ul>
    );
  }

  _buildGridItems(items, itemType) {
    const {
      layout,
      textColor,
      padding,
      showPill,
      showTimestamp,
      timestampOptions = {}
    } = this.props;

    return items.map((item, index) => {
      return (
        <CategoryLink item={item} key={index} >
          <Item
            item={item}
            layout={layout}
            itemType={itemType}
            textColor={textColor}
            showTimestamp={showTimestamp}
            padding={padding}
            showPill={showPill}
            timestampOptions={timestampOptions}
          />
        </CategoryLink>);
    });
  }

  render() {
    const {
      FRN_rawResponses: [{
        data: {
          features: items = []
        } = {}
      } = {}] = [],
      title = '',
      titleColor,
      textColor,
      backgroundColor,
      imagePlacement,
      showTimestamp,
      showReadMore,
      layout,
      expandBackground,
      totalNumberOfItems
    } = this.props;

    let gridContent = [];
    let gridItems = [];
    let listItems = []
    switch (layout) {
      case layoutType.GRID:
        gridItems = items.slice(0,2);
        listItems = items.slice(2, 6);
        const colProps = {
          xs: 12,
          md: 6
        };
        gridContent = (
          <Row>
            <Col {...colProps}>
              <Row>{this._buildGridItems(gridItems, itemType.GRID)}</Row>
            </Col>
            <Col {...colProps}>
              <Row>{this._buildListItems(listItems)}</Row>
            </Col>
          </Row>
        );
        break;
      case layoutType.HERO:
        gridItems = items.slice(1,3);
        const heroItems = items.slice(0,1);
        listItems = items.slice(3, 9);
        gridContent = (
          <Row>
            <Col lg={6} xs={12} md={8}>
              <Row>{this._buildGridItems(heroItems, itemType.HERO)}</Row>
            </Col>
            <Col lg={3} xs={12} md={4}>
              <Row>{this._buildGridItems(gridItems, itemType.GRID)}</Row>
            </Col>
            <Col lg={3} xs={12} md={12}>
              <Row>{this._buildListItems(listItems)}</Row>
            </Col>
          </Row>
        );
        break;

      default:
        break;
    }

    const backgroundClasses = classNames(
      'CategoryGrid-background',
      { expandToEdges: expandBackground });

    return (
      <div className="CategoryGrid" style={{backgroundColor}}>
        {title ?
          <Row>
            <ComponentTitle color={titleColor} title={title} />
            {showReadMore ?
              <div className="CategoryGrid-readMore">
                <a href="#" style={{color: titleColor}}>more category<ChevronRight color={titleColor} /> </a>
              </div> : null}
          </Row> : null}
        {gridContent}
        <span className={backgroundClasses} style={{backgroundColor}}></span>
      </div>
    );
  }
}

class CategoryLink extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    children: PropTypes.node
  }

  render() {
    const {
      item: {
        type = '',
        id = '',
        seo: { pageurl: slug = ''} = {}
        } = {},
      } = this.props;

    let href;

    if (typeof location === 'undefined') {
      return this.props.children;
    } else {
      href = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + type + '/' + id + '/' + slug;
    }

    return (
      <a href={href}>
        {this.props.children}
      </a>
    );
  }
}

class Item extends Component {

  render() {
    const {
      item: {
        headline = '',
        abstractimage: { filename: newsImage = '' } = {},
        surfaceable: [ { type: featureType = '' } = {} ] = [],
        contentClassification: pillLabel = '',
        type = '',
        publishedDate
      } = {},
      itemType = itemType.GRID,
      layout: layoutType = layoutType.GRID,
      textColor = '#FFFFFF',
      showTimestamp = false,

      timestampOptions: {
        showElapsedTime,
        displayShortDateTime
      } = {},
      padding = 2,
      showPill = false,
      titleColor = '#000000'
    } = this.props;

    const isItemHero = (itemType === 'hero');
    const isLayoutHero = (layoutType === 'hero');
    const gridItemHeight = (HERO_ITEM_HEIGHT / 2) - padding;
    const wrapperStyles = {
      // height: `${isItemHero ? HERO_ITEM_HEIGHT : gridItemHeight}px`,
      backgroundImage: newsImage ? `url(${newsImage})` : null
    };

    const isVideoAttached = featureType.toLowerCase() === 'clip' || type.toLowerCase() === 'clip';

    const imageThumbnailClassName = classNames(
      'embed-responsive embed-responsive-16by9',
      'CategoryGrid-thumbnail',
      {
        'CategoryGrid-element CategoryGrid-coverPhoto': isItemHero,
        'CategoryGrid-gridItem CategoryGrid-item': !isItemHero
      }
    );
    const headlineSmallClassName = classNames(
      'CategoryGrid-headlineSmall',
      {
        'CategoryGrid-headlineSmall-videoThumnail': isVideoAttached,
        'CategoryGrid-thumbnail-hero': isItemHero
      }
    )

    const colProps = {
      xs: 12,
      md: 6
    };

    const colHero = isLayoutHero ? null : colProps;

    return (
      <Col {...colHero} className="CategoryGrid-itemWraper" style={{padding: `0px 0px ${padding}px ${padding}px`}}>
        <div className={imageThumbnailClassName} style={wrapperStyles}>
          <div className="CategoryGrid-pictureText">
            {showPill && <span className="CategoryGrid-categoryHeader">{pillLabel}</span>}
            {isLayoutHero &&
              <p className={headlineSmallClassName} style={{color: textColor}}>{headline}</p>
            }
            {showTimestamp && isLayoutHero ? <Timestamp publishDate={publishedDate} showElapsedTime={showElapsedTime} displayShortDateTime={displayShortDateTime}/> : null}
          </div>
        </div>
        {!isLayoutHero &&
            <p className={headlineSmallClassName} style={{color: textColor}}>{headline}</p>
        }
      </Col>
    );
  }
}

export default SideBySideArticle;

