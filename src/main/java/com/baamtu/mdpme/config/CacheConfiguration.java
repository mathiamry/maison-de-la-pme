package com.baamtu.mdpme.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.baamtu.mdpme.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.baamtu.mdpme.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.baamtu.mdpme.domain.User.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Authority.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.User.class.getName() + ".authorities");
            createCache(cm, com.baamtu.mdpme.domain.Turnover.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Turnover.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Language.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Language.class.getName() + ".countries");
            createCache(cm, com.baamtu.mdpme.domain.Language.class.getName() + ".persons");
            createCache(cm, com.baamtu.mdpme.domain.FrequentlyAskedQuestion.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Notification.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.History.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Size.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Size.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Experience.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Experience.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Bank.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Bank.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Country.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Country.class.getName() + ".smeHouses");
            createCache(cm, com.baamtu.mdpme.domain.ActivityArea.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.ActivityArea.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Need.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Need.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.SMEHouse.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.SMEHouse.class.getName() + ".advisors");
            createCache(cm, com.baamtu.mdpme.domain.SMEHouse.class.getName() + ".partners");
            createCache(cm, com.baamtu.mdpme.domain.SMEHouse.class.getName() + ".smes");
            createCache(cm, com.baamtu.mdpme.domain.Sme.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Sme.class.getName() + ".representatives");
            createCache(cm, com.baamtu.mdpme.domain.Sme.class.getName() + ".files");
            createCache(cm, com.baamtu.mdpme.domain.SmeRepresentative.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.SmeRepresentative.class.getName() + ".appointments");
            createCache(cm, com.baamtu.mdpme.domain.UnavailabilityPeriod.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.UnavailabilityPeriod.class.getName() + ".advisors");
            createCache(cm, com.baamtu.mdpme.domain.UnavailabilityPeriod.class.getName() + ".partnerRepresentatives");
            createCache(cm, com.baamtu.mdpme.domain.AvailabilityTimeslot.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.AvailabilityTimeslot.class.getName() + ".advisors");
            createCache(cm, com.baamtu.mdpme.domain.AvailabilityTimeslot.class.getName() + ".partnerRepresentatives");
            createCache(cm, com.baamtu.mdpme.domain.Anonymous.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Partner.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Partner.class.getName() + ".representings");
            createCache(cm, com.baamtu.mdpme.domain.PartnerRepresentative.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.PartnerRepresentative.class.getName() + ".appointmnents");
            createCache(cm, com.baamtu.mdpme.domain.PartnerRepresentative.class.getName() + ".availabilityTimeslots");
            createCache(cm, com.baamtu.mdpme.domain.PartnerRepresentative.class.getName() + ".unavailabilityPeriods");
            createCache(cm, com.baamtu.mdpme.domain.Advisor.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Advisor.class.getName() + ".appointmnents");
            createCache(cm, com.baamtu.mdpme.domain.Advisor.class.getName() + ".availabilityTimeslots");
            createCache(cm, com.baamtu.mdpme.domain.Advisor.class.getName() + ".unavailabilityPeriods");
            createCache(cm, com.baamtu.mdpme.domain.Appointment.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.News.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.News.class.getName() + ".notifications");
            createCache(cm, com.baamtu.mdpme.domain.Event.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Event.class.getName() + ".participants");
            createCache(cm, com.baamtu.mdpme.domain.Event.class.getName() + ".notifications");
            createCache(cm, com.baamtu.mdpme.domain.Administrator.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Administrator.class.getName() + ".houseSmes");
            createCache(cm, com.baamtu.mdpme.domain.Tender.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Tender.class.getName() + ".files");
            createCache(cm, com.baamtu.mdpme.domain.Tender.class.getName() + ".notifications");
            createCache(cm, com.baamtu.mdpme.domain.File.class.getName());
            createCache(cm, com.baamtu.mdpme.domain.Person.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
