import React, { PureComponent } from 'react';
import { Select, message, Drawer, List, Switch, Divider, Icon, Button } from 'antd';
import { formatMessage } from 'umi/locale';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { connect } from 'dva';
import styles from './index.less';
import ThemeColor from './ThemeColor';
import BlockChecbox from './BlockChecbox';

const Body = ({ children, title, style }) => (
  <div
    style={{
      ...style,
      marginBottom: 24,
    }}
  >
    <h3 className={styles.title}>{title}</h3>
    {children}
  </div>
);

@connect(({ setting }) => ({ setting }))
class SettingDarwer extends PureComponent {
  getLayOutSetting = () => {
    const {
      setting: { grid, fixedHeader, layout, autoHideHeader, fixSiderbar },
    } = this.props;
    return [
      {
        title: formatMessage({ id: 'app.setting.gridmode' }),
        action: [
          <Select
            value={grid}
            size="small"
            onSelect={value => this.changeSetting('grid', value)}
            style={{ width: 80 }}
          >
            <Select.Option value="Wide">
              {formatMessage({ id: 'app.setting.gridmode.wide' })}
            </Select.Option>
            <Select.Option value="Fluid">
              {formatMessage({ id: 'app.setting.gridmode.fluid' })}
            </Select.Option>
          </Select>,
        ],
      },
      {
        title: formatMessage({ id: 'app.setting.fixedheader' }),
        action: [
          <Switch
            size="small"
            checked={!!fixedHeader}
            onChange={checked => this.changeSetting('fixedHeader', checked)}
          />,
        ],
      },
      {
        title: formatMessage({ id: 'app.setting.hideheader' }),
        hide: !fixedHeader,
        action: [
          <Switch
            size="small"
            checked={!!autoHideHeader}
            onChange={checked => this.changeSetting('autoHideHeader', checked)}
          />,
        ],
      },
      {
        title: formatMessage({ id: 'app.setting.fixedsidebar' }),
        hide: layout === 'topmenu',
        action: [
          <Switch
            size="small"
            checked={!!fixSiderbar}
            onChange={checked => this.changeSetting('fixSiderbar', checked)}
          />,
        ],
      },
    ].filter(item => {
      return !item.hide;
    });
  };

  changeSetting = (key, value) => {
    const { setting } = this.props;
    const nextState = { ...setting };
    nextState[key] = value;
    if (key === 'layout') {
      if (value === 'topmenu') {
        nextState.grid = 'Wide';
      } else {
        nextState.grid = 'Fluid';
      }
    }
    if (key === 'fixedHeader') {
      if (!value) {
        nextState.autoHideHeader = false;
      }
    }
    this.setState(nextState, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'setting/changeSetting',
        payload: this.state,
      });
    });
  };

  togglerContent = () => {
    const { setting } = this.props;
    this.changeSetting('collapse', !setting.collapse);
  };

  render() {
    const { setting } = this.props;
    const { collapse, silderTheme, themeColor, layout, colorWeak } = setting;
    return (
      <Drawer
        visible={collapse}
        width={273}
        onClose={this.togglerContent}
        placement="right"
        handler={
          <div className={styles.handle}>
            {!collapse ? (
              <Icon
                type="setting"
                style={{
                  color: '#FFF',
                  fontSize: 20,
                }}
              />
            ) : (
              <Icon
                type="close"
                style={{
                  color: '#FFF',
                  fontSize: 20,
                }}
              />
            )}
          </div>
        }
        onHandleClick={this.togglerContent}
        style={{
          zIndex: 999,
        }}
      >
        <div className={styles.content}>
          <Body title={formatMessage({ id: 'app.setting.pagestyle' })}>
            <BlockChecbox
              list={[
                {
                  key: 'dark',
                  url: 'https://gw.alipayobjects.com/zos/rmsportal/LCkqqYNmvBEbokSDscrm.svg',
                },
                {
                  key: 'light',
                  url: 'https://gw.alipayobjects.com/zos/rmsportal/jpRkZQMyYRryryPNtyIC.svg',
                },
              ]}
              value={silderTheme}
              onChange={value => this.changeSetting('silderTheme', value)}
            />
          </Body>

          <ThemeColor
            title={formatMessage({ id: 'app.setting.themecolor' })}
            value={themeColor}
            onChange={color => this.changeSetting('themeColor', color)}
          />

          <Divider />

          <Body title={formatMessage({ id: 'app.setting.navigationmode' })}>
            <BlockChecbox
              list={[
                {
                  key: 'sidemenu',
                  url: 'https://gw.alipayobjects.com/zos/rmsportal/JopDzEhOqwOjeNTXkoje.svg',
                },
                {
                  key: 'topmenu',
                  url: 'https://gw.alipayobjects.com/zos/rmsportal/KDNDBbriJhLwuqMoxcAr.svg',
                },
              ]}
              value={layout}
              onChange={value => this.changeSetting('layout', value)}
            />
          </Body>

          <List
            split={false}
            dataSource={this.getLayOutSetting()}
            renderItem={item => <List.Item actions={item.action}>{item.title}</List.Item>}
          />

          <Divider />

          <Body title={formatMessage({ id: 'app.setting.othersettings' })}>
            <List.Item
              actions={[
                <Switch
                  size="small"
                  checked={!!colorWeak}
                  onChange={checked => this.changeSetting('colorWeak', checked)}
                />,
              ]}
            >
              {formatMessage({ id: 'app.setting.weakmode' })}
            </List.Item>
          </Body>
          <Divider />
          <CopyToClipboard
            text={JSON.stringify(setting)}
            onCopy={() => message.success(formatMessage({ id: 'app.setting.copyinfo' }))}
          >
            <Button
              style={{
                width: 224,
              }}
            >
              <Icon type="copy" />
              {formatMessage({ id: 'app.setting.copy' })}
            </Button>
          </CopyToClipboard>
          <div className={styles.productionHint}>
            {formatMessage({ id: 'app.setting.production.hint' })}
          </div>
        </div>
      </Drawer>
    );
  }
}

export default SettingDarwer;
